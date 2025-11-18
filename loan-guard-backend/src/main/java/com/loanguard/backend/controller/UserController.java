package com.loanguard.backend.controller;

import com.loanguard.backend.model.User;
import com.loanguard.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        User dbUser = userService.findByUsername(user.getUsername());
        if (dbUser != null && dbUser.getPassword().equals(user.getPassword())) {
            return dbUser;
        }
        return null;
    }

    @PostMapping("/register")
    public int register(@RequestBody User user) {
        user.setRole("user");
        user.setStatus("active");
        return userService.insert(user);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }
}