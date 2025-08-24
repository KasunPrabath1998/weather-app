package org.example.gg.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class WeatherResponse {
    private String cityName;
    private String country;
    private String description;
    private double temp;
    private double tempMin;
    private double tempMax;
    private int pressure;
    private int humidity;
    private double visibilityKm;
    private String sunrise;
    private String sunset;
    private double windSpeed;
    private int windDegree;
    private String time;

    public WeatherResponse(String cityName, String country, String description,
                           double temp, double tempMin, double tempMax,
                           int pressure, int humidity, double visibilityKm,
                           String sunrise, String sunset,
                           double windSpeed, int windDegree, String time) {
        this.cityName = cityName;
        this.country = country;
        this.description = description;
        this.temp = temp;
        this.tempMin = tempMin;
        this.tempMax = tempMax;
        this.pressure = pressure;
        this.humidity = humidity;
        this.visibilityKm = visibilityKm;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.windSpeed = windSpeed;
        this.windDegree = windDegree;
        this.time = time;
    }
}
