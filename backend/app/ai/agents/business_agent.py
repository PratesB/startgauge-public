import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.ai.prompts.business_prompt import BUSINESS_AGENT_PROMPT
from app.canvas.schemas import CanvasSchema

async def run_business_agent(
    idea_title: str,
    idea_description: str,
    user_background: str,
    country: str,
    research_context: str
) -> CanvasSchema:

    """
    Business Agent: Receives the Idea data and the Researcher's Report,
    and returns the 9 filled blocks of the Canvas.
    Uses "Structured Outputs" to force the return in JSON validated by Pydantic.

    """


    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    prompt = BUSINESS_AGENT_PROMPT.format(
        idea_title=idea_title,
        idea_description=idea_description,
        user_background=user_background,
        country=country,
        research_context=research_context
    )
    
    response = await client.aio.models.generate_content(
        model='gemini-3.6-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=CanvasSchema,
            temperature=0.7 
        )
    )
 
    canvas_dict = json.loads(response.text)
    
    return CanvasSchema(**canvas_dict)
