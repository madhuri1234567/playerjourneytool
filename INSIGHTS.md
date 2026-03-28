# Game Insights

Three observations discovered using the Player Journey Visualization Tool on 5 days of LILA BLACK production data (Feb 10–14, 2026).

---

## 1. AmbroseValley Dominates the Map Rotation (71% of Matches)

**What caught my eye:** Filtering by map in the tool immediately showed a massive imbalance.

**The data:**
| Map | Matches | Share |
|-----|---------|-------|
| AmbroseValley | 566 | 71.1% |
| Lockdown | 171 | 21.5% |
| GrandRift | 59 | 7.4% |

GrandRift gets less than 1/10th the play of AmbroseValley. This could indicate:
- GrandRift is not in preferred rotation, or has restricted queue times
- Players actively avoid it (poor map design? frustrating layout?)
- It may only be available in certain modes

**Actionable:** Investigate GrandRift's low pick rate. If it's a rotation issue, adjust matchmaking weights. If players are avoiding it, use the heatmap overlay to identify which areas players avoid and where deaths cluster — that points to unfair spawn locations or choke points. **Metrics to track:** Queue times per map, match completion rate, voluntary extraction rate.

**Why a Level Designer should care:** If 71% of your players never experience two of your three maps, the level design investment in GrandRift and Lockdown isn't paying off.

---

## 2. Player Activity Drops 87% Over 5 Days

**What caught my eye:** Switching between dates in the filter bar, the match count drops dramatically.

**The data:**
| Date | Matches | Drop from Day 1 |
|------|---------|-----------------|
| Feb 10 | 285 | — |
| Feb 11 | 200 | -30% |
| Feb 12 | 162 | -43% |
| Feb 13 | 112 | -61% |
| Feb 14 | 37 | -87% |

Even accounting for Feb 14 being a partial day, the trend is steep. This suggests either:
- A live event or update on Feb 10 drove a spike that naturally decayed
- Server/matchmaking issues reduced available matches
- Player retention issues in the current build

**Actionable:** Cross-reference with player acquisition data. If Feb 10 had a marketing push or update, this is expected decay. If not, investigate whether gameplay friction (storm deaths, bot ratio, loot distribution) is driving churn. **Metrics to track:** D1/D3/D7 retention, session length per day, matches per unique player per day.

**Why a Level Designer should care:** If players aren't coming back, it may indicate the maps don't offer enough variety or replayability in routing options.

---

## 3. Matches Are Mostly Solo Player + Bots

**What caught my eye:** The player legend rarely shows more than 1-2 human paths in any match.

**The data:**
- Average human players per match: ~1.0
- Maximum humans in a single match: 2
- Average bots per match: ~0.6
- Maximum bots in a single match: 15

The vast majority of matches have a single human player surrounded by bots. This could mean:
- The player base is small enough that matchmaking fills with bots
- Bot backfill is aggressive — starting matches before enough humans queue
- This is by design for an extraction shooter (solo-focused gameplay)

**Actionable:** If this isn't intentional, adjust matchmaking to wait longer for human opponents. Track the **human-to-bot kill ratio** — if players are mostly farming bots, the PvP experience (a core differentiator) isn't happening. **Metrics to track:** % of matches with 2+ humans, average wait time vs bot fill rate, human vs human encounter rate.

**Why a Level Designer should care:** Map design for PvE (player vs bots) is fundamentally different from PvP. If most combat is against bots, choke points and ambush spots designed for PvP engagement are going unused. The level design should optimize for the gameplay that's actually happening.
