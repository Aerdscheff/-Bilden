from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional


app = FastAPI()


class Proposal(BaseModel):
    """Represents a proposal submitted by a user.

    The minimal data model reflects the fields exposed in the front‑end
    form. In a production system these would be stored in a database
    (e.g. Supabase) with additional metadata such as author_id,
    timestamps and versioning. For this MVP they live in memory.
    """

    id: str
    title: str
    description: str
    context: Optional[str] = None
    theme: str
    location: Optional[str] = None
    need: Optional[str] = None
    actors: Optional[str] = None
    author_id: Optional[str] = None


class Swipe(BaseModel):
    """Captures a user's swipe on a proposal.

    action can be one of 'consent', 'objection' or 'clarification'.
    comment is optional but is required for objection and clarification.
    """

    user_id: str
    proposal_id: str
    action: str
    comment: Optional[str] = None


# In‑memory stores. In a real app these would reside in a database.
proposals: List[dict] = []
clarifications: List[dict] = []
objections: List[dict] = []
swipes: List[dict] = []


@app.get("/")
def root():
    """Health check root endpoint."""
    return {"message": "Hello from Ä/Bilden API"}


@app.post("/proposals")
def create_proposal(proposal: Proposal):
    """Create a new proposal.

    In a production setting the ID would be generated server‑side.
    For simplicity we accept a client‑provided UUID.
    """
    proposals.append(proposal.dict())
    return {"status": "created", "id": proposal.id}


@app.get("/proposals/{theme}")
def get_proposals(theme: str):
    """Return proposals by theme.

    A special theme 'fast' returns all proposals. This is used
    for the Fast feed which mixes all themes together.
    """
    if theme == "fast":
        return proposals
    return [p for p in proposals if p.get("theme") == theme]


@app.get("/proposals/user/{user_id}")
def get_user_proposals(user_id: str):
    """Return proposals created by a given user."""
    return [p for p in proposals if p.get("author_id") == user_id]


@app.post("/swipe")
def record_swipe(swipe: Swipe):
    """Record a swipe and create objection/clarification entries.

    Consent swipes are simply stored; objection and clarification
    swipes also create entries in the respective lists.
    """
    swipes.append(swipe.dict())
    if swipe.action == "clarification":
        clarifications.append({
            "id": f"clar-{len(clarifications)+1}",
            "proposal_id": swipe.proposal_id,
            "question": swipe.comment or "",
            "answer": None,
            "user_id": swipe.user_id,
        })
    elif swipe.action == "objection":
        objections.append({
            "id": f"obj-{len(objections)+1}",
            "proposal_id": swipe.proposal_id,
            "description": swipe.comment or "",
            "suggested_change": None,
            "user_id": swipe.user_id,
        })
    return {"status": "recorded"}


@app.get("/clarifications")
def list_clarifications():
    """List all clarifications."""
    return clarifications


@app.get("/clarifications/user/{user_id}")
def list_user_clarifications(user_id: str):
    """List clarifications authored by a specific user."""
    return [c for c in clarifications if c.get("user_id") == user_id]


@app.get("/objections")
def list_objections():
    """List all objections."""
    return objections


@app.get("/objections/user/{user_id}")
def list_user_objections(user_id: str):
    """List objections authored by a specific user."""
    return [o for o in objections if o.get("user_id") == user_id]