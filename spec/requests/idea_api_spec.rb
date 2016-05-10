require "rails_helper"

describe "api returns all ideas" do
  it "can return all ideas" do
    idea = Idea.create(title: "Baconator", body: "Lovely bacon")
    Idea.create(title: "Wendy's", body: "Lovely bacon")
    Idea.create(title: "Awesome", body: "Lovely bacon")
    get "/api/v1/ideas.json"

    json = JSON.parse(response.body)

    expect(json.count).to eq(3)
    expect(json.first["title"]).to eq("Baconator")
  end
end

describe "api creates new idea" do
  it "can create a new idea" do
    post "/api/v1/ideas.json", {title: "Bacon", body: "You know dat bacon"}

    expect(response.status).to eq(201)
    expect(Idea.first.title).to eq("Bacon")
  end
end
