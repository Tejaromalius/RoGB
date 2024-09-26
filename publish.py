# publish.py
import subprocess

if __name__ == "__main__":
  try:
    subprocess.run(["gep", "build"], check=True)
    subprocess.run(["gep", "publish", "--directory", "./src"], check=True)
  except subprocess.CalledProcessError as e:
    print(f"Error occurred: {e}")
