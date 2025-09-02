"""
Script to run the Streamlit VEO3 Video Generator app
Usage: python run_streamlit.py
"""

import subprocess
import sys
import os

def main():
    # Check if streamlit is installed
    try:
        import streamlit
    except ImportError:
        print("Installing required packages...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # Check if .env.local exists
    if not os.path.exists('.env.local'):
        print("⚠️  Warning: .env.local file not found!")
        print("Please create .env.local file with your GEMINI_API_KEY")
        print("Example content:")
        print("GEMINI_API_KEY=your_api_key_here")
        return
    
    # Run streamlit app
    print("🎬 Starting VEO3 Video Generator...")
    print("🌐 Open your browser and go to: http://localhost:8501")
    
    try:
        subprocess.run([sys.executable, "-m", "streamlit", "run", "streamlit_app.py"])
    except KeyboardInterrupt:
        print("\n👋 App stopped by user")

if __name__ == "__main__":
    main()