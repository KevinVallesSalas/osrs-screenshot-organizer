# OSRS Screenshot Organizer

A React and Vite-powered web app that organizes and visualizes OSRS Runelite screenshots locally. It provides automatic categorization, custom tagging, and interactive analytics—all without uploading your images.

## Features

- **Local File Access:**  
  Use the File System Access API to select and read your Runelite screenshot directory.
- **Thumbnail Generation & Lazy Loading:**  
  Generate low-resolution thumbnails with the Canvas API and implement lazy loading to speed up browsing.
- **Automatic Categorization:**  
  Detect built-in categories such as boss kills, levels, and pets from file names or metadata.
- **Custom Categories:**  
  Create and manage your own tags to further organize your screenshots.
- **Data Analytics Dashboard:**  
  Visualize trends like screenshot dates, event frequency, and more with interactive charts.