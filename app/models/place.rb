class Place

  def read
      # google API which returns places within the specified radius of the given location coordinates
    url = "https://maps.googleapis.com/maps/api/place/radarsearch/json?location=51.503186,-0.126446&radius=500&type=museum&key=AIzaSyCJj9kSrensH6kVLTBPWflEYb-OoC1VLc4"

    # HTTParty calls the google API and we are storing the API response a varialbe called response
    response = HTTParty.get(url)

    # the bulk of the data we need is in the results portion of the response object
    responses = response["results"]

    # we are looping through the responses, parsing out the place_id, and storing all of the id's in an instance variable
    @place_ids = []
    responses.map do |place|
      @place_ids << place["place_id"]
    end
  end

  def place_details
    # we are looping through all of the place_ids and then calling the Google API in order to retrieve the Place's name, which we are storing in the @place_name instance varialbe array
    @place_name = []
    @place_ids.each do |id|
      url  = "https://maps.googleapis.com/maps/api/place/details/json?placeid=#{id}&key=AIzaSyCJj9kSrensH6kVLTBPWflEYb-OoC1VLc4"
      response = HTTParty.get(url)
     @place_name << response["result"]["name"]
    end
    @place_name
  end

end
