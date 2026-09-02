CREATE TABLE `categories` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `slug` text NOT NULL
);
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);
CREATE TABLE `products` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `price` integer NOT NULL,
  `category_id` integer NOT NULL,
  `image` text NOT NULL,
  `featured` integer DEFAULT 0 NOT NULL,
  `active` integer DEFAULT 1 NOT NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
);
CREATE UNIQUE INDEX `products_name_unique` ON `products` (`name`);
CREATE INDEX `idx_products_category` ON `products` (`category_id`);
CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `role` text DEFAULT 'customer' NOT NULL,
  `created_at` text NOT NULL
);
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE TABLE `orders` (
  `id` text PRIMARY KEY NOT NULL,
  `user_email` text NOT NULL,
  `customer_name` text NOT NULL,
  `address` text NOT NULL,
  `total` integer NOT NULL,
  `status` text NOT NULL,
  `payment_method` text NOT NULL,
  `created_at` text NOT NULL
);
CREATE INDEX `idx_orders_status` ON `orders` (`status`);
CREATE TABLE `order_items` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `order_id` text NOT NULL,
  `product_id` integer NOT NULL,
  `name` text NOT NULL,
  `price` integer NOT NULL,
  `quantity` integer NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`)
);
CREATE INDEX `idx_order_items_order` ON `order_items` (`order_id`);
