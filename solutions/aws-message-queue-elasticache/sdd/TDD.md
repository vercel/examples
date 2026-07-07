# Test-Driven Development Rubrics

| # | Functional area | Rubrics |
|---|----------------|---------|
| 1 | Message submission | 1.1 – 1.3 |
| 2 | Message consumption | 2.1 – 2.3 |
| 3 | Message acknowledgment | 3.1 – 3.2 |
| 4 | Reliability | 4.1 – 4.3 |

## 1. Message submission

### 1.1 Valid contact form is queued
- **Given** a visitor fills in name, email, and message
- **When** they submit the contact form
- **Then** the message is added to the queue and the visitor receives a confirmation with a timestamp

### 1.2 Incomplete form is rejected
- **Given** a visitor leaves one or more required fields empty
- **When** they attempt to submit the contact form
- **Then** the submission is rejected with a clear error indicating which requirement was not met

### 1.3 Oversized input is rejected
- **Given** a visitor provides input exceeding length limits (name > 200, email > 320, message > 10000 characters)
- **When** they attempt to submit the contact form
- **Then** the submission is rejected before reaching the queue

## 2. Message consumption

### 2.1 Reviewer receives next unprocessed message
- **Given** one or more messages exist in the queue
- **When** a reviewer opens the processing view
- **Then** the oldest unprocessed message is displayed with its name, email, message content, and submission timestamp

### 2.2 Empty queue is communicated
- **Given** no unprocessed messages remain in the queue
- **When** a reviewer opens the processing view
- **Then** the reviewer sees a clear "no messages" indicator

### 2.3 Same message is not delivered to multiple reviewers
- **Given** multiple reviewers are consuming from the queue
- **When** each reviewer requests the next message
- **Then** each reviewer receives a different message — no duplicates

## 3. Message acknowledgment

### 3.1 Acknowledged message is removed from the queue
- **Given** a reviewer has a message displayed
- **When** they click Acknowledge
- **Then** the message is permanently removed from the pending list and will not appear again

### 3.2 Reviewer can proceed to next message after acknowledgment
- **Given** a reviewer has just acknowledged a message
- **When** they request the next message
- **Then** the next unprocessed message is displayed (or empty-queue indicator if none remain)

## 4. Reliability

### 4.1 Unacknowledged messages are recovered
- **Given** a message was delivered to a reviewer but never acknowledged (e.g., browser closed)
- **When** another reviewer requests a message after 60 seconds of idle time
- **Then** the abandoned message is reclaimed and delivered to the new reviewer, visibly marked as recovered

### 4.2 Page refresh does not cause duplicate processing
- **Given** a reviewer is viewing a consumed message
- **When** they refresh the page
- **Then** the same message is not re-delivered as a new message (it remains in pending until acknowledged)

### 4.3 Stream does not grow unbounded
- **Given** messages are continuously submitted over time
- **When** the stream exceeds its maximum length
- **Then** the oldest entries are trimmed automatically to cap memory usage
