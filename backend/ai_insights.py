from typing import Dict, Any
import os
import random

from typing import Dict, Any
import os
import random
from datetime import date, timedelta

def get_insights_from_simulation(simulation_results: Dict[str, Any], budget: float = 0.0, start_date: date = None, end_date: date = None) -> Dict[str, Any]:
    """
    Generates AI-powered insights from simulation results using a rule-based expert system.
    """
    base_duration = simulation_results.get('base_duration', 0)
    total_duration = simulation_results.get('total_duration', 0)
    total_cost = simulation_results.get('total_cost', 0)
    risk_events = simulation_results.get('risk_events', 0)
    
    issues = []
    recommendations = []
    
    # Schedule Analysis
    schedule_status = "Unknown"
    if start_date and end_date:
        projected_finish = start_date + timedelta(days=total_duration)
        if projected_finish > end_date:
            delay_days = (projected_finish - end_date).days
            issues.append(f"Deadline Missed: Project is projected to finish on {projected_finish}, which is {delay_days} days after the deadline ({end_date}).")
            schedule_status = "Behind"
            recommendations.append("Review critical path tasks for crashing or fast-tracking.")
        else:
            buffer_days = (end_date - projected_finish).days
            issues.append(f"On Schedule: Project is projected to finish on {projected_finish}, {buffer_days} days before the deadline.")
            schedule_status = "Ahead"
    else:
        # Fallback to comparing against baseline if no deadline dates provided
        if total_duration > base_duration:
            delay = total_duration - base_duration
            issues.append(f"Schedule Slippage: The project is projected to take {total_duration} days, which is {delay} days longer than the baseline.")
            recommendations.append("Review the Critical Path tasks for optimization opportunities.")
            recommendations.append("Analyze the 'Triggered Risks' to understand what caused the delay.")
        else:
            issues.append("Schedule: The project is projected to finish on or ahead of the baseline schedule.")

    # Cost Analysis
    if budget > 0:
        if total_cost > budget:
            overrun = total_cost - budget
            pct = (overrun / budget) * 100
            issues.append(f"Budget Overrun: Projected cost is ${total_cost:,.2f}, exceeding budget by ${overrun:,.2f} ({pct:.1f}%).")
            recommendations.append("Investigate resource utilization and fixed costs.")
        else:
            issues.append(f"Budget: Projected cost (${total_cost:,.2f}) is within the budget of ${budget:,.2f}.")
    else:
        # If budget isn't passed or is 0, we can't do variance analysis
        issues.append(f"Projected Total Cost: ${total_cost:,.2f}.")

    # Risk Analysis
    if risk_events > 0:
        issues.append(f"Risk Impact: {risk_events} risk events occurred during the simulation.")
        recommendations.append("Ensure contingency plans are in place for high-probability risks.")
    else:
        issues.append("Risk Impact: No risk events occurred in this run.")

    assessment = " ".join(issues)
    
    return {
        "overallAssessment": assessment,
        "keyIssues": [{"id": f"ki-{i}", "text": issue} for i, issue in enumerate(issues)],
        "actionableRecommendations": [{"id": f"ar-{i}", "text": rec} for i, rec in enumerate(recommendations)]
    }
