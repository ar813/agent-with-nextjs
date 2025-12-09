from agents import Agent, Runner, set_tracing_disabled, AsyncOpenAI, OpenAIChatCompletionsModel
import os
from dotenv import load_dotenv

load_dotenv()

groq_api_key = os.environ.get("GROQ_API_KEY")
groq_base_url = os.environ.get("GROQ_BASE_URL")

groq_client = AsyncOpenAI(
    api_key=groq_api_key,
    base_url=groq_base_url
)

groq_model = OpenAIChatCompletionsModel(
    model="llama-3.3-70b-versatile",
    openai_client=groq_client 
)

math_agent = Agent(
    name="Math Teacher", 
    instructions="You are a math tutor", 
    model=groq_model,
)

set_tracing_disabled(True)

result = Runner.run_sync(
    starting_agent = math_agent, 
    input = "2+2=",
)

print(result.final_output)