"""
NHL Stats Tracker Backend API

This FastAPI application provides NHL statistics data using the nhl-api-py library.
It serves as a backend for the NHL Stats Tracker frontend application.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from nhlpy import NHLClient
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NHL Stats Tracker API",
    description="Backend API for NHL Stats Tracker using nhl-api-py",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize NHL API client
nhl_client = NHLClient()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "NHL Stats Tracker API is running"}


@app.get("/api/teams")
async def get_teams():
    """Get all NHL teams"""
    try:
        teams = nhl_client.teams.teams()
        return {"teams": teams}
    except Exception as e:
        logger.error(f"Error fetching teams: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/schedule/{team_abbr}/{season}")
async def get_team_schedule(team_abbr: str, season: str):
    """
    Get full season schedule for a team
    
    Args:
        team_abbr: Three-letter team abbreviation (e.g., VGK, TOR)
        season: Season in YYYYYYYY format (e.g., 20242025)
    """
    try:
        schedule = nhl_client.schedule.team_season_schedule(
            team_abbr=team_abbr,
            season=season
        )
        return schedule
    except Exception as e:
        logger.error(f"Error fetching schedule for {team_abbr} season {season}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stats/{team_abbr}/{season}")
async def get_team_stats(team_abbr: str, season: str, game_type: int = 2):
    """
    Get team statistics for a season
    
    Args:
        team_abbr: Three-letter team abbreviation (e.g., VGK, TOR)
        season: Season in YYYYYYYY format (e.g., 20242025)
        game_type: Game type (2=Regular season, 3=Playoffs)
    """
    try:
        # Get roster data
        roster = nhl_client.teams.team_roster(team_abbr=team_abbr, season=season)
        
        # Get club stats - this returns skaters and goalies with their stats
        club_stats_url = f"club-stats/{team_abbr}/{season}/{game_type}"
        from nhlpy.http_client import Endpoint
        club_stats_response = nhl_client.http_client.get(
            endpoint=Endpoint.API_WEB_V1,
            resource=club_stats_url
        )
        club_stats = club_stats_response.json()
        
        return {
            "roster": roster,
            "stats": club_stats
        }
    except Exception as e:
        logger.error(f"Error fetching stats for {team_abbr} season {season}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/standings")
async def get_standings(date: Optional[str] = None):
    """
    Get league standings
    
    Args:
        date: Optional date in YYYY-MM-DD format. If not provided, returns current standings.
    """
    try:
        standings = nhl_client.standings.league_standings(date=date)
        return standings
    except Exception as e:
        logger.error(f"Error fetching standings: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/game/{game_id}")
async def get_game_details(game_id: str):
    """
    Get detailed game information including boxscore
    
    Args:
        game_id: NHL game ID (e.g., 2024020001)
    """
    try:
        boxscore = nhl_client.game_center.boxscore(game_id=game_id)
        
        # Try to get play-by-play summary as well
        try:
            from nhlpy.http_client import Endpoint
            landing_response = nhl_client.http_client.get(
                endpoint=Endpoint.API_WEB_V1,
                resource=f"gamecenter/{game_id}/landing"
            )
            landing_data = landing_response.json()
            boxscore["landing"] = landing_data
        except:
            pass  # Landing data is optional
            
        return boxscore
    except Exception as e:
        logger.error(f"Error fetching game details for {game_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/player/{player_id}/career")
async def get_player_career(player_id: str):
    """
    Get player career statistics
    
    Args:
        player_id: NHL player ID
    """
    try:
        career_stats = nhl_client.stats.player_career_stats(player_id=player_id)
        return career_stats
    except Exception as e:
        logger.error(f"Error fetching career stats for player {player_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
