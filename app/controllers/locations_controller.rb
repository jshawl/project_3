class LocationsController < ApplicationController

  def search
    render json: Place.read(params[:q])
  end

  def create
    @location = Location.create location_params
    render json: @location
  end
  # and add delete method

  private

  def location_params
    params.permit(:name, :lat, :long, :place_id, :trip_id)
  end

end
