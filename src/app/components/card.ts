import { Component, input, Input, OnInit, signal } from '@angular/core';
import { actions_hidden, Computer, computers, conection } from '../../global/storage';

type Coords = {
    x: number,
    y: number
};

@Component({
  selector: 'card',
  styleUrl: './card.css',
  templateUrl: './card.html',
})

export class Card{
  image_64 = input<string>();
  name_user = input<string>();
  id = input<string>();
  isActiveKeyboard = input<boolean>();
  isActiveMouse = input<boolean>();
  inputLog = input<string>();

  computers = computers;
  actions_hidden = actions_hidden;

  changeStateKeyboardInput(event: MouseEvent) {
    this.computers.update(prev => {
      const next = [...prev].map(([id, pc]): [string, Computer] => {
        if (id == this.id()) 
          return [id,
          {...pc, input_keyboard_enable: !(pc.input_keyboard_enable ?? false)}];

        return [id, pc];
      });

      return new Map(next);
    });

  }

  changeStateMouseInput(event: MouseEvent) {
    this.computers.update(prev => {
      const next = [...prev].map(([id, pc]): [string, Computer] => {
        if (id == this.id()) 
          return [id,
          {...pc, input_mouse_enable: !(pc.input_mouse_enable ?? false)}];

        return [id, pc];
      });

      return new Map(next);
    });

  }

  onClickImage(event: MouseEvent) {
    const img = event.currentTarget as HTMLImageElement;
    const rect = img.getBoundingClientRect();

    // Porcentajes de x y y con respecto a la pantalla
    const x = (event.clientX - rect.left) / rect.width * 100;
    const y = (event.clientY - rect.top) / rect.height * 100;

    this.computers.update(prev => {
      const next = new Map(
        [...prev].map(([id, pc]) => {
          var input: string = pc.input_log;
          if (pc.input_mouse_enable == true) {
            this.sendMouseInput(pc, {x: x, y: y});

            input = input + ` MouseClick (x=${x}%, y${y}%)`
          };

          return [id, { ...pc, input_log: input }]
        })
      );

      return next;
    })
  }

  private sendMouseInput(pcTarget: Computer, coords: Coords) {
    conection.send( JSON.stringify({
      type: 'input',
      input_type: 'mouse_click',
      input: coords,
      targetId: pcTarget.id
    }));
  }
}
