from google import genai
from google.genai import types
from ddgs import DDGS
from app.core.config import settings
from app.ai.prompts.research_prompt import RESEARCH_AGENT_PROMPT



async def run_research_agent(
    idea_title: str,
    idea_description: str,
    user_background: str,
    country: str
) -> str:

    """
    Research Agent: Uses DuckDuckGo (DDGS) to gather real market data, then synthesizes it using Gemini.

    """
   
    search_query = f"{idea_title} {idea_description} competitors market in {country}"
    web_search_results = ""
    
    try:
        with DDGS() as ddgs:

            results = ddgs.text(search_query, max_results=10)
            
            formatted_results = []
            for i, r in enumerate(results, 1):
                formatted_results.append(
                    f"Result {i}:\nTitle: {r.get('title')}\nLink: {r.get('href')}\nSummary: {r.get('body')}\n"
                )
            web_search_results = "\n".join(formatted_results)
            
    except Exception as e:
        web_search_results = "Web search failed. Proceed using internal knowledge only."


    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    prompt = RESEARCH_AGENT_PROMPT.format(
        idea_title=idea_title,
        idea_description=idea_description,
        country=country,
        web_search_results=web_search_results
    )
    

    response = client.models.generate_content(
        model='gemini-3.6-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.3 
        )
    )
    
    return response.text
