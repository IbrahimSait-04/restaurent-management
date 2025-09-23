import { Menu } from "../models/menu.js";

// Create Menu Item
export const createMenuItem = async (req, res) => {
  const { name, description, price, category, image } = req.body;
    try {
    const menuItem = new Menu({ name, description, price, category, image });
    await menuItem.save();
    res.status(201).json({
      message: "Menu item created successfully",
      menuItem: {
        id: menuItem._id,
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        category: menuItem.category,
        image: menuItem.image,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get  Menu Items
export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json({ menuItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Menu Item
export const updateMenuItem = async (req, res) => {
  const { menuItemId } = req.params;
  const { name, description, price, category, image } = req.body;
  try {
    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = price;
    if (category) menuItem.category = category;
    if (image) menuItem.image = image;

    await menuItem.save();
    res.status(200).json({ message: "Menu item updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Menu Item by ID
export const deleteMenuItem = async (req, res) => {
  const { menuItemId } = req.params;
    try {
    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    await menuItem.remove();
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  