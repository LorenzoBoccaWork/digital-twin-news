import schedule
import time
from analysis_pipeline import run_analysis_pipeline

print("🤖 AI Scheduler avviato — ogni 20 minuti")

run_analysis_pipeline()

schedule.every(20).minutes.do(run_analysis_pipeline)

while True:
    schedule.run_pending()
    time.sleep(60)