package org.example.gg.controller;

import org.example.gg.model.WeatherResponse;
import org.example.gg.service.WeatherService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class WeatherController {

    private final WeatherService service;

    public WeatherController(WeatherService service) {
        this.service = service;
    }

    @GetMapping("/api/weather")
    public List<WeatherResponse> getWeather() {
        return service.getWeatherData();
    }
}
