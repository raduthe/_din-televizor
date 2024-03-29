import { rad2deg, vec3_t, normalize_angle } from "./math.js";

export class tool_t {
  constructor(map, renderer)
  {
    this.canvas = document.getElementById("tool");
    this.ctx = this.canvas.getContext("2d");
    
    this.wall_pos = new vec3_t(0.0, 0.0, 0.0);
    this.wall_side = false;
    this.wall_id = 0;
    this.renderer = renderer;
    this.map = map;
    
    this.map.listen("add_image", (image) => {
      this.wall_id = this.map.images.length;
      this.draw_images(this.map);
    });
    
    this.map.listen("remove_image", (id) => {
      this.draw_images();
      this.wall_id = 0;
    });
    
    this.canvas.addEventListener("click", (e) => {
      const x = Math.floor(e.offsetX / 50);
      const y = Math.floor(e.offsetY / 50);
      
      const id = x + y * 4 + 1;
      
      if (id <= this.map.images.length) {
        this.wall_id = id;
        this.draw_images();
      }
    });
  }
  
  draw_images()
  {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.map.images.length; i++) {
      const id = i + 1;
      const x = ((id - 1) % 4) * 50;
      const y = Math.floor((id - 1) / 4) * 50;
      
      this.ctx.drawImage(this.map.images[i], x, y, 50, 50);
      
      if (id == this.wall_id) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        this.ctx.fillRect(x, y, 50, 50);
      }
    }
  }
  
  edit_map(camera, game, input)
  {
    if (this.wall_id == 0)
      return;
    
    if (input.action["place"]) {
      this.map.place(game.front_pos, game.front_side, this.wall_id);
    }
    
    if (input.action["door"]) {
      const url = prompt("URL");
      this.map.place_door(game.front_pos, game.front_side, this.wall_id, url);
    }
    
    if (input.action["remove"]) {
      this.map.remove(game.front_pos, game.wall_side, this.wall_id);
    }
  }
  
  remove_selected_image()
  {
    this.map.remove_image(this.wall_id);
  }
};
