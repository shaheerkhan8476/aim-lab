package supabase

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/google/uuid"
	supabase "github.com/nedpals/supabase-go"
	model "gitlab.msu.edu/team-corewell-2025/models"
)

var Supabase *supabase.Client

func InitClient(url, key string) *supabase.Client {
	Supabase = supabase.CreateClient(url, key)
	return Supabase
}

func SignUpUser(w http.ResponseWriter, r *http.Request) {
	var userRequest UserCreateRequest
	bodyBytes, _ := io.ReadAll(r.Body)
	err := json.Unmarshal(bodyBytes, &userRequest)
	if err != nil {
		print(err)
	}
	ctx := context.Background()
	user, err := Supabase.Auth.SignUp(ctx, supabase.UserCredentials{
		Email:    userRequest.Email,
		Password: userRequest.Password,
	})
	if err != nil {
		print(err)
	}
	parsedID, err := uuid.Parse(user.ID)
	if err != nil {
		print(err)
	}
	newUser := model.User{
		Id:      parsedID,
		Name:    userRequest.Name,
		Email:   userRequest.Email,
		IsAdmin: false,
	}
	err = Supabase.DB.From("users").Insert(newUser).Execute(nil)
	if err != nil {
		print(err)
	}
	b, err := json.Marshal(user)
	if err != nil {
		print("Error", err)
	}
	w.Write(b)
}
