import { Component, HostListener, input, OnInit, signal } from '@angular/core';
import { Card } from './components/card';
import { actions_hidden, Computer, computers, conection } from '../global/storage';

@Component({
  imports: [Card],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App implements OnInit {
  protected readonly title = signal('remote-controller');

  // Estilo de columna
  grid_template_columns = signal<string>('');
  computers = computers;

  ngOnInit(): void {
    conection.addEventListener('message', (msg) => {
      let data = JSON.parse(msg.data);

      // console.log(data);

      switch (data.type) {
        case 'image':
          this.computers.update(prev => {
            const next = new Map(prev);

            next.set(data.id, {
              image_64: data.image_64,
              id: data.id,
              name_user: data.name_user,
              input_log: prev.has(data.id) ? prev.get(data.id)?.input_log ?? '' : '',
              input_keyboard_enable: prev.has(data.id) ? prev.get(data.id)?.input_keyboard_enable ?? false : false,
              input_mouse_enable: prev.has(data.id) ? prev.get(data.id)?.input_mouse_enable ?? false : false,
            });

            return next;
          });
          break;

        case 'delete':
          this.computers.update(prev => {
            const next = new Map(prev);
            next.delete(data.id);
            return next;
          });
          break;
      }
    })

  }



  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

    this.computers.update(prev => {
      const next = new Map(
        [...prev].map(([id, pc]) => {
          var input: string = pc.input_log;
          if (pc.input_keyboard_enable == true) {
            this.sendKeyboardInput(pc, event.key);

            input = input + event.key
          };

          return [id, { ...pc, input_log: input }]
        })
      );

      return next;
    })
  }

  changeActions(event: MouseEvent) {
    this.computers.update(prev => {
      const next = new Map(
        [...prev].map(([id, pc]) => {
          return [id, { ...pc, input_keyboard_enable: false, input_mouse_enable: false }]
        })
      );

      return next;
    })

    actions_hidden.set(!actions_hidden());
  }

  private sendKeyboardInput(pcTarget: Computer, keyPressed: string) {
    conection.send( JSON.stringify({
      type: 'input',
      input_type: 'keyboard',
      input: keyPressed,
      targetId: pcTarget.id
    }));
  }
}