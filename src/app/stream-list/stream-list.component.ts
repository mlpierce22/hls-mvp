import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { LiveStream, VideoDimensions } from '../app.models';
import Sortable from 'sortablejs';

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss']
})
export class StreamListComponent implements OnInit {

  @Input() liveStreams: LiveStream[]

  @Input() listedStreamDim: VideoDimensions

  @Input() posterUrl: string

  @Output() focusVideo: EventEmitter<number> = new EventEmitter<number>();

  @Output() toggleVideoSelect: EventEmitter<number> = new EventEmitter<number>();

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  @Output() drop: EventEmitter<Object> = new EventEmitter<Object>();

  constructor() { }

  ngOnInit() {
    const streamList = document.querySelector("camio-live-streams").shadowRoot.getElementById("streamList")
    Sortable.create(streamList, {
      handle: '.dragger',
      animation: 150,
      easing: "cubic-bezier(1, 0, 0, 1)",
      ghostClass: "ghost",
      chosenClass: "chosen",
      onEnd: (ev) => this.drop.emit(ev),
      // store: {
      //   // /**
      //   //  * Get the order of elements. Called once during initialization.
      //   //  * @param   {Sortable}  sortable
      //   //  * @returns {Array}
      //   //  */
      //   // get: (sortable) => {
      //   //   return 
      //   //   var order = localStorage.getItem(sortable.options.group.name);
      //   //   return order ? order.split('|') : [];
      //   // },
    
      //   /**
      //    * Save the order of elements. Called onEnd (when the item is dropped).
      //    * @param {Sortable}  sortable
      //    */
      //   set: (sortable) => {
      //     const regexStream = /stream-currIndex-[0-9]+/
      //     const regexNumber= /[0-9]+/
      //     let match: Array<number> = new Array<number>();
      //     sortable.el.children.forEach(child => {
      //       let temp = child.classList.value.match(regexStream)[0]
      //       match.push(temp.match(regexNumber)[0] as number)
      //     })

      //     //newArray
      //     match.forEach((match, index) => {
      //       this.liveStreams[index]
      //     })
      //     // let order = sortable.toArray();
      //     // let sortableArray = order.join('|')
      //     // console.log(order)
      //     // localStorage.setItem(sortable.options.group.name, order.join('|'));
      //   }
      // }
    });
  }

  trackByFn(index, item) {
    return index; 
  }
}
