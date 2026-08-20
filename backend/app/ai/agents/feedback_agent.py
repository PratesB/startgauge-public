import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.ai.prompts.feedback_prompt import FEEDBACK_AGENT_PROMPT
from app.canvas.schemas import FeedbackSchema




async def run_feedback_agent(
    idea_description: str,
    user_background: str,
    canvas_json: str
) -> FeedbackSchema:

    """
    Feedback Agent: Performs a Skill Gap Analysis by comparing the user's background
    against the execution requirements of their generated Business Model Canvas.
    Uses "Structured Outputs" to force the return in JSON validated by Pydantic.

    """
    
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    prompt = FEEDBACK_AGENT_PROMPT.format(
        idea_description=idea_description,
        user_background=user_background,
        canvas_json=canvas_json
    )
    
    
    response = await client.aio.models.generate_content(
        model='gemini-3.6-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=FeedbackSchema,
            temperature=0.4 
        )
    )
    
    feedback_dict = json.loads(response.text)
    
    return FeedbackSchema(**feedback_dict)
