package com.targetindia;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.targetindia.model.User;
import com.targetindia.model.UserList;
import com.targetindia.utils.KeyboardUtil;
import org.json.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;



/*
@SpringBootApplication
public class HmSclientApplication {

	public static void main(String[] args) {

		SpringApplication.run(HmSclientApplication.class, args);
	}

}
*/

public class HmSclientApplication {

	public static void main(String[] args) {
		String url = "http://localhost:8080/api/users";
		RestTemplate template = new RestTemplate();

		int choice;
		the_loop:
		while (true) {

			System.out.println("\n*** Main Menu ***");
			System.out.println("0. Exit");
			System.out.println("1. Login");
			System.out.println("2. Register");
			System.out.println("3. List all Users");



			try {
				choice = KeyboardUtil.getInt("Enter your choice: ");
			} catch (Exception e) {
				choice = -1;
			}

			switch (choice) {
				case 0:
					System.out.println("Exiting...");
					break the_loop;
				case 1:String email = KeyboardUtil.getString("Enter Email: ");
					   String password = KeyboardUtil.getString("Enter Password: ");
					String url1 = url+"/login";
					System.out.println(url1);
					HttpHeaders headers = new HttpHeaders();
					headers.setContentType(MediaType.APPLICATION_JSON);
					var userObject = new JSONObject();
					userObject.put("email", email);
					userObject.put("password", password);
					HttpEntity<String> request =
							new HttpEntity<String>(userObject.toString(), headers);
					String userResultAsJsonStr =
							template.postForObject(url1, request, String.class);
					System.out.println("Logging status :"+ userResultAsJsonStr);


					break;

				case 2:
					System.out.println("Not yet implemented.");
					break;
				case 3:

					var resp2 = template.getForObject(url, UserList.class);
					resp2.getUsers().forEach(System.out::println);
					break;
				default:
					System.out.println("Invalid choice. Please try again.");
			}
		}
	}

	}




