"""
Human-in-the-loop Learning System.
- 3+ rejects of same action_type → confidence_multiplier *= 0.7
- On edits → store mean param-delta as offset for next run
"""
from collections import defaultdict
from statistics import mean
from typing import List, Dict, Any


def update_learning_weights(feedback_rows: List[Dict[str, Any]]) -> Dict[str, dict]:
    weights: Dict[str, dict] = {}
    rejects: Dict[str, int] = defaultdict(int)
    edits: Dict[tuple, list] = defaultdict(list)

    for fb in feedback_rows:
        at = fb["action_type"]
        if fb["response"] == "reject":
            rejects[at] += 1
        elif fb["response"] == "edit" and fb.get("edited_params"):
            for k, v in fb["edited_params"].items():
                rec = (fb.get("recommended_params") or {}).get(k)
                if isinstance(rec, (int, float)) and isinstance(v, (int, float)):
                    edits[(at, k)].append(v - rec)

    for at, count in rejects.items():
        if count >= 3:
            weights.setdefault(at, {})["confidence_multiplier"] = 0.7

    for (at, k), deltas in edits.items():
        weights.setdefault(at, {}).setdefault("param_offsets", {})[k] = round(mean(deltas), 2)

    return weights
