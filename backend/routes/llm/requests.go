package llm

type MessageRequest struct {
	Message  string `json:"message"`
	TaskType string `json:"taskType"`
}
