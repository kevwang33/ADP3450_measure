import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Path to file
file_path = 'test_rec1.csv'

# Read the file manually
with open(file_path, 'r') as file:
    lines = file.readlines()

# Skip the metadata headers and start with the data
data_lines = lines[10:]  # Start from line 10 (0-indexed, so the 11th line)

# Parse the CSV data
time_values = []
voltage_values = []

for line in data_lines:
    parts = line.strip().split(',')
    if len(parts) >= 2:  # Ensure there are at least two values
        try:
            time_values.append(float(parts[0]))
            voltage_values.append(float(parts[1]))
        except ValueError:
            # Skip lines that can't be converted to float
            continue

# Convert to numpy arrays for easier manipulation
time = np.array(time_values)
voltage = np.array(voltage_values)

# Filter out any values before time 0s
positive_time_mask = time >= 0
time_filtered = time[positive_time_mask]
voltage_filtered = voltage[positive_time_mask]

# Print basic information
print(f"Original data points: {len(voltage)}")
print(f"Data points after filtering (t >= 0): {len(voltage_filtered)}")
print(f"Filtered data removed: {len(voltage) - len(voltage_filtered)} points")
print(f"Time range: {time_filtered.min():.6f} to {time_filtered.max():.6f} seconds")

# Create the plot
plt.figure(figsize=(12, 6))
plt.plot(time_filtered * 1000, voltage_filtered * 1000, linewidth=1)  # Convert time to ms, voltage to mV

# Add labels and title
plt.xlabel('Time (ms)')
plt.ylabel('Voltage (mV)')
plt.title('Oscilloscope Data: Voltage vs Time (t ≥ 0s)')
plt.grid(True, alpha=0.3)

# Calculate some basic statistics
mean_voltage = voltage_filtered.mean()
max_voltage = voltage_filtered.max()
min_voltage = voltage_filtered.min()
duration = time_filtered.max() - time_filtered.min()


# Show the plot
plt.tight_layout()
plt.show()

print(f"\nMean voltage: {mean_voltage:.6f} V ({mean_voltage*1000:.2f} mV)")
print(f"Maximum voltage: {max_voltage:.6f} V ({max_voltage*1000:.2f} mV)")
print(f"Minimum voltage: {min_voltage:.6f} V ({min_voltage*1000:.2f} mV)")