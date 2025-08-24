package org.example.gg.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.gg.model.WeatherResponse;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String API_KEY = "89508abdf329373f1be6f40472787e2d";

    private List<Integer> loadCityIds() {
        try {
            InputStream inputStream = new ClassPathResource("cities.json").getInputStream();
            JsonNode cities = objectMapper.readTree(inputStream);
            List<Integer> ids = new ArrayList<>();
            for (JsonNode city : cities) {
                ids.add(city.get("id").asInt());
            }
            return ids;
        } catch (Exception e) {
            throw new RuntimeException("Error loading city IDs", e);
        }
    }

    private String formatUnixTime(long unixSeconds, int offsetSeconds) {
        Date date = new Date((unixSeconds + offsetSeconds) * 1000L);
        SimpleDateFormat sdf = new SimpleDateFormat("h:mma");
        return sdf.format(date).toLowerCase();
    }

    private String formatCurrentTime(long unixSeconds, int offsetSeconds) {
        Date date = new Date((unixSeconds + offsetSeconds) * 1000L);
        SimpleDateFormat sdf = new SimpleDateFormat("h:mma, MMM d");
        return sdf.format(date).toLowerCase();
    }

    private String capitalize(String text) {
        if (text == null || text.isEmpty()) return "";
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

    @Cacheable("weatherData")
    public List<WeatherResponse> getWeatherData() {
        List<Integer> ids = loadCityIds();
        List<WeatherResponse> result = new ArrayList<>();

        for (Integer cityId : ids) {
            try {
                String url = String.format(
                        "https://api.openweathermap.org/data/2.5/weather?id=%d&units=metric&appid=%s",
                        cityId, API_KEY
                );

                JsonNode r = restTemplate.getForObject(url, JsonNode.class);
                if (r == null || !r.has("main")) continue;

                int tzOffset = r.has("timezone") ? r.get("timezone").asInt() : 0;

                WeatherResponse wr = new WeatherResponse(
                        r.get("name").asText(),
                        r.get("sys").get("country").asText(),
                        capitalize(r.get("weather").get(0).get("description").asText()),
                        r.get("main").get("temp").asDouble(),
                        r.get("main").get("temp_min").asDouble(),
                        r.get("main").get("temp_max").asDouble(),
                        r.get("main").get("pressure").asInt(),
                        r.get("main").get("humidity").asInt(),
                        r.has("visibility") ? r.get("visibility").asDouble() / 1000 : 0,
                        formatUnixTime(r.get("sys").get("sunrise").asLong(), tzOffset),
                        formatUnixTime(r.get("sys").get("sunset").asLong(), tzOffset),
                        r.get("wind").get("speed").asDouble(),
                        r.get("wind").get("deg").asInt(),
                        formatCurrentTime(r.get("dt").asLong(), tzOffset)
                );

                result.add(wr);

            } catch (Exception e) {
                System.err.println("Error fetching weather for city ID " + cityId + ": " + e.getMessage());
            }
        }

        return result;
    }
}
