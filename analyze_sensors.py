#!/usr/bin/env python3
"""
Sensor Data Analysis Script
Analyzes CSV files exported from the local storage mode
"""

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path
import sys

def load_sensor_data(csv_file):
    """Load sensor data from CSV file"""
    print(f"Loading data from {csv_file}...")
    df = pd.read_csv(csv_file)
    print(f"Loaded {len(df)} data points")
    print(f"Columns: {df.columns.tolist()}")
    print(f"Sensor types: {df['Sensor Type'].unique()}")
    print(f"Context: {df['Context'].iloc[0]}")
    return df

def plot_sensor_data(df, output_dir='plots'):
    """Create visualizations of sensor data"""
    output_dir = Path(output_dir)
    output_dir.mkdir(exist_ok=True)
    
    context = df['Context'].iloc[0] if 'Context' in df.columns else 'unknown'
    
    # Separate data by sensor type
    orientation_data = df[df['Sensor Type'] == 'orientation']
    accelerometer_data = df[df['Sensor Type'] == 'accelerometer']
    gyroscope_data = df[df['Sensor Type'] == 'gyroscope']
    
    # Plot 1: Orientation over time
    if not orientation_data.empty:
        fig, axes = plt.subplots(3, 1, figsize=(12, 8))
        fig.suptitle(f'Device Orientation - {context}', fontsize=16)
        
        time = orientation_data['Relative Time (s)']
        axes[0].plot(time, orientation_data['X'], 'b-', label='Alpha (Z-axis)')
        axes[0].set_ylabel('Alpha (degrees)')
        axes[0].legend()
        axes[0].grid(True)
        
        axes[1].plot(time, orientation_data['Y'], 'g-', label='Beta (X-axis)')
        axes[1].set_ylabel('Beta (degrees)')
        axes[1].legend()
        axes[1].grid(True)
        
        axes[2].plot(time, orientation_data['Z'], 'r-', label='Gamma (Y-axis)')
        axes[2].set_ylabel('Gamma (degrees)')
        axes[2].set_xlabel('Time (seconds)')
        axes[2].legend()
        axes[2].grid(True)
        
        plt.tight_layout()
        plot_file = output_dir / f'orientation_{context}.png'
        plt.savefig(plot_file, dpi=150)
        print(f"Saved plot: {plot_file}")
        plt.close()
    
    # Plot 2: Accelerometer over time
    if not accelerometer_data.empty:
        fig, axes = plt.subplots(3, 1, figsize=(12, 8))
        fig.suptitle(f'Accelerometer Data - {context}', fontsize=16)
        
        time = accelerometer_data['Relative Time (s)']
        axes[0].plot(time, accelerometer_data['X'], 'b-', label='X-axis')
        axes[0].set_ylabel('Acceleration X (m/s²)')
        axes[0].legend()
        axes[0].grid(True)
        
        axes[1].plot(time, accelerometer_data['Y'], 'g-', label='Y-axis')
        axes[1].set_ylabel('Acceleration Y (m/s²)')
        axes[1].legend()
        axes[1].grid(True)
        
        axes[2].plot(time, accelerometer_data['Z'], 'r-', label='Z-axis')
        axes[2].set_ylabel('Acceleration Z (m/s²)')
        axes[2].set_xlabel('Time (seconds)')
        axes[2].legend()
        axes[2].grid(True)
        
        plt.tight_layout()
        plot_file = output_dir / f'accelerometer_{context}.png'
        plt.savefig(plot_file, dpi=150)
        print(f"Saved plot: {plot_file}")
        plt.close()
    
    # Plot 3: Gyroscope over time
    if not gyroscope_data.empty:
        fig, axes = plt.subplots(3, 1, figsize=(12, 8))
        fig.suptitle(f'Gyroscope Data - {context}', fontsize=16)
        
        time = gyroscope_data['Relative Time (s)']
        axes[0].plot(time, gyroscope_data['X'], 'b-', label='X-axis')
        axes[0].set_ylabel('Rotation Rate X (°/s)')
        axes[0].legend()
        axes[0].grid(True)
        
        axes[1].plot(time, gyroscope_data['Y'], 'g-', label='Y-axis')
        axes[1].set_ylabel('Rotation Rate Y (°/s)')
        axes[1].legend()
        axes[1].grid(True)
        
        axes[2].plot(time, gyroscope_data['Z'], 'r-', label='Z-axis')
        axes[2].set_ylabel('Rotation Rate Z (°/s)')
        axes[2].set_xlabel('Time (seconds)')
        axes[2].legend()
        axes[2].grid(True)
        
        plt.tight_layout()
        plot_file = output_dir / f'gyroscope_{context}.png'
        plt.savefig(plot_file, dpi=150)
        print(f"Saved plot: {plot_file}")
        plt.close()
    
    # Plot 4: Combined 3D magnitude
    if not accelerometer_data.empty:
        fig, ax = plt.subplots(figsize=(12, 6))
        
        time = accelerometer_data['Relative Time (s)']
        magnitude = np.sqrt(
            accelerometer_data['X']**2 + 
            accelerometer_data['Y']**2 + 
            accelerometer_data['Z']**2
        )
        
        ax.plot(time, magnitude, 'purple', linewidth=2)
        ax.set_xlabel('Time (seconds)')
        ax.set_ylabel('Acceleration Magnitude (m/s²)')
        ax.set_title(f'Total Acceleration Magnitude - {context}')
        ax.grid(True)
        
        plt.tight_layout()
        plot_file = output_dir / f'magnitude_{context}.png'
        plt.savefig(plot_file, dpi=150)
        print(f"Saved plot: {plot_file}")
        plt.close()

def analyze_statistics(df):
    """Calculate and print statistics"""
    print("\n" + "="*50)
    print("STATISTICAL ANALYSIS")
    print("="*50)
    
    for sensor_type in df['Sensor Type'].unique():
        sensor_data = df[df['Sensor Type'] == sensor_type]
        
        print(f"\n{sensor_type.upper()}:")
        print(f"  Data points: {len(sensor_data)}")
        print(f"  Duration: {sensor_data['Relative Time (s)'].max():.2f} seconds")
        
        for axis in ['X', 'Y', 'Z']:
            values = sensor_data[axis]
            print(f"  {axis}-axis:")
            print(f"    Mean: {values.mean():.2f}")
            print(f"    Std: {values.std():.2f}")
            print(f"    Min: {values.min():.2f}")
            print(f"    Max: {values.max():.2f}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python analyze_sensors.py <csv_file>")
        print("\nExample:")
        print("  python analyze_sensors.py sensor_data_walking_2025-10-14.csv")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    
    if not Path(csv_file).exists():
        print(f"Error: File '{csv_file}' not found!")
        sys.exit(1)
    
    # Load data
    df = load_sensor_data(csv_file)
    
    # Analyze statistics
    analyze_statistics(df)
    
    # Create plots
    print("\nGenerating plots...")
    plot_sensor_data(df)
    
    print("\nAnalysis complete!")
    print("Check the 'plots' directory for visualizations.")

if __name__ == "__main__":
    main()
