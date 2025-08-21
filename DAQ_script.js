var date = "08_21_2025"
var dst_path = "/Users/zhiyuan/Documents/DAQ_RL/"
var filename = "test_recording"
var recording_duration_s = 3e-3
Scope1.Trigger.Source.text = "Channel 1" //channel to read the trigger signal 
//trigger signal type def
Scope1.Trigger.Type.text = "Edge" 
Scope1.Trigger.Condition.text = "Falling"
Scope1.Trigger.Trigger.text = "Normal"

// Set Record mode
Scope1.Time.Mode.text = "Record"

// Set desired sample rate
Scope1.Time.Rate.value = 12.5e6

// Explicitly set sample count to match 3ms at 12.5MHz
var desiredSampleCount = 12.5e6 * recording_duration_s // 12.5MHz * 3ms = 37,500 samples
Scope1.Time.Samples.value = desiredSampleCount

// Make sure Channel 2 is enabled for acquisition
Scope1.Channel2.checked = true

// Apply configuration and ensure it takes effect
Scope1.config()
wait(0.5)

// Check what we got
var timeSpan = Scope1.Time.Base.value * 10 // 10 divisions
var expectedSamples = Math.round(timeSpan * Scope1.Time.Rate.real)



print("\n=== Starting Continuous Recording ===")
print("Recording will continue until program is terminated...")
print("Press Stop or terminate the program to end recording.")

// Continuous recording loop
var recordingNumber = 1
while(true) {
    print("\n=== Recording " + recordingNumber + " ===")
    print("Waiting for trigger from Channel 1 falling edge...")
    
    // Start acquisition
    Scope1.single()
    Scope1.wait()
    
    if(Scope1.State.text == "Done") {
        print("Acquisition " + recordingNumber + " completed successfully!")
        
        // Export data with unique filename
        var file = dst_path + date + "/" + filename + recordingNumber + ".csv"
        Scope1.Export(file)
        print("Data saved to " + file)
        
        print("=== Recording " + recordingNumber + " Results ===")
        print("Sample rate: " + (Scope1.Time.Rate.real / 1e6).toFixed(3) + " MHz")
        print("Sample count: " + Scope1.Time.Samples.real)
        print("Duration: " + (Scope1.Time.Samples.real / Scope1.Time.Rate.real * 1000).toFixed(3) + " ms")
        print("Position: " + Scope1.Time.Position.value)
        print("Requested samples: " + desiredSampleCount)
        print("Actual samples: " + Scope1.Time.Samples.real)
        
        recordingNumber++ // Increment for next recording
    } else {
        print("Acquisition " + recordingNumber + " failed. Current state: " + Scope1.State.text)
        print("Stopping continuous recording due to acquisition failure.")
        break // Exit the loop if an acquisition fails
    }
    
    // Small delay between recordings
    wait(0.1)
}

print("\n=== Recording Stopped ===")
print("Total recordings completed: " + (recordingNumber - 1))