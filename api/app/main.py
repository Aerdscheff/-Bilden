from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List
from supabase import create_client, Client
import os
import random
from datetime import datetime

# Initialize Supabase client
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

app = FastAPI()

class Proposal(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    context: Optional[str] = None
    theme: str
    location: Optional[str] = None
    need: Optional[str] = None
    actors: Optional[str] = None
    author_id: Optional[str] = None

class Clarification(BaseModel):
    proposal_id: str
    user_id: Optional[str] = None
    question: str

class Objection(BaseModel):
    proposal_id: str
    user_id: Optional[str] = None
    description: str
    suggested_change: Optional[str] = None

@app.get("/")
def root():
    return {"message": "Hello from Ä/Bilden API"}

@app.post("/proposals")
def create_proposal(proposal: Proposal):
    data = proposal.dict(exclude_unset=True)
    response = supabase.table("proposals").insert(data).execute()
    return response.data[0] if response.data else data

@app.get("/proposals/{theme}")
def get_proposals_by_theme(theme: str):
    response = supabase.table("proposals").select("*").eq("theme", theme).execute()
    return response.data or []

@app.get("/proposals/fast")
def get_fast_proposals():
    response = supabase.table("proposals").select("*").execute()
    proposals = response.data or []
    random.shuffle(proposals)
    return proposals

@app.post("/clarification")
def post_clarification(clarif: Clarification):
    data = clarif.dict()
    data["created_at"] = datetime.utcnow().isoformat()
    supabase.table("clarifications").insert(data).execute()
    return {"status": "ok"}

@app.get("/clarifications")
def get_clarifications():
    response = supabase.table("clarifications").select("*").execute()
    return response.data or []

@app.post("/objection")
def post_objection(obj: Objection):
    data = obj.dict()
    data["created_at"] = datetime.utcnow().isoformat()
    data["status"] = "open"
    supabase.table("objections").insert(data).execute()
    return {"status": "ok"}

@app.get("/objections")
def get_objections():
    response = supabase.table("objections").select("*").execute()
    return response.data or []

@app.get("/stats/{proposal_id}")
def get_stats(proposal_id: str):
    clarif_count = supabase.table("clarifications").select("id").eq("proposal_id", proposal_id).execute()
    obj_count = supabase.table("objections").select("id").eq("proposal_id", proposal_id).execute()
    return {
        "clarifications": len(clarif_count.data) if clarif_count.data else 0,
        "objections": len(obj_count.data) if obj_count.data else 0
    }

@app.post("/cron/auto-seal")
def auto_seal(x_cron_token: str = Header(None)):
    expected_token = os.environ.get("CRON_TOKEN")
    # Token check: Accept header "Authorization: Bearer <token>" or plain token
    token = x_cron_token.replace("Bearer ", "") if x_cron_token else None
    if expected_token and token != expected_token:
        raise HTTPException(status_code=401, detail="Invalid token")
    # TODO: implement sealing logic (check consent thresholds, update decision_state)
    return {"sealed": 0, "message": "Auto-seal stub executed"}

@app.get("/export/decision-json/{proposal_id}")
def export_decision_json(proposal_id: str):
    proposal = supabase.table("proposals").select("*").eq("id", proposal_id).execute().data
    return {
        "proposal": proposal,
        "decision": "Stub export",
        "timestamp": datetime.utcnow().isoformat()
    }
