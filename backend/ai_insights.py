from typing import Dict, Any
import os
import random

def get_insights_from_simulation(simulation_results: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates AI-powered insights from simulation results.

    In a real implementation, this would make a call to a generative AI API (e.g., Gemini).
    For now, it returns a mock response based on the simulation data.
    """
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key or api_key == "YOUR_API_KEY_HERE":
        # Return a mock response if no API key is provided
        return {
            "ai_assessment": "Mock Assessment: The simulation results indicate a high probability of schedule overrun. The base duration is optimistic, while the P80 duration suggests a significant buffer is needed.",
            "ai_recommendations": [
                "Mock Recommendation 1: Review the tasks on the critical path, as they are the primary drivers of the project's duration.",
                "Mock Recommendation 2: Allocate additional resources to critical path tasks to reduce their duration.",
                "Mock Recommendation 3: Develop mitigation plans for the risks that have the highest probability and impact."
            ]
        }

    # The following is a placeholder for a real API call.
    # 1. Format the `simulation_results` into a detailed prompt.
    # 2. Make an HTTP request to the Gemini API.
    # 3. Parse the response and return it in a structured format.
    
    # Mocking a real call for demonstration purposes
    base_duration = simulation_results.get('base_duration', 0)
    p80_duration = simulation_results.get('p80_duration', 0)
    
    assessment = f"The deterministic project duration is {base_duration:.0f} days. However, the Monte Carlo simulation shows an 80% probability of finishing in {p80_duration:.0f} days or less, indicating a potential schedule slippage of {(p80_duration - base_duration):.0f} days."
    
    recommendations = [
        "Focus on mitigating risks associated with the tasks on the critical path.",
        "Consider adding a buffer to the schedule based on the P80 duration.",
        "Investigate tasks with the highest slack, as they may have opportunities for resource reallocation."
    ]
    
    return {
        "ai_assessment": assessment,
        "ai_recommendations": recommendations
    }
