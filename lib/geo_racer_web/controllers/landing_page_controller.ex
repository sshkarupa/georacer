defmodule GeoRacerWeb.LandingPageController do
  use GeoRacerWeb, :controller

  def show(conn, _params) do
    render(conn, "show.html", %{})
  end
end
