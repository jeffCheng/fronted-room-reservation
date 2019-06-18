import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  constructor(private  httpClient: HttpClient ) {}

  roomObservable: Observable<Room[]>;

  private baseUrl = 'http://localhost:8080';
  public submitted: boolean;
  roomsearch: FormGroup;
  rooms: Room[];
  currCheckInVal: string;
  currCheckOutVal: string;

    ngOnInit() {
        this.roomsearch = new FormGroup({
            checkin: new FormControl(''),
            checkout: new FormControl('')
        });

        const roomSearchChange = this.roomsearch.valueChanges;

        roomSearchChange.subscribe(
          valueChange => {
            this.currCheckInVal = valueChange.checkin;
            this.currCheckOutVal = valueChange.checkout;
          }
        );
    }

    reserveRoom(value: string) {
      console.log('Room checkin for reservation:' + this.currCheckInVal);
      this.createRoomReservation(new RoomRequest(value, this.currCheckInVal, this.currCheckOutVal));
      console.log('Room id for reservation:' + value);
    }

    createRoomReservation(body: RoomRequest) {
      const bodyString = JSON.stringify(body);
      const options = {headers: {'Content-Type': 'application/json'}};
      this.httpClient.post(this.baseUrl + '/room/reservation/v1', bodyString , options)
      .subscribe(
        data  => {
          console.log('PATCH Request is successful ', data);
        },
        error  => {
          console.log('Error', error);
        });
    }

    onSubmit({value, valid}: {value: Roomsearch, valid: boolean}) {
      this.getAll().subscribe(
        (result: any) => { this.rooms = result.content; },
        err => {
          console.log(err);
        }
      );
      console.log(value);
    }

    getAll(): Observable<Room[]> {
      return this.httpClient.get<Room[]>(this.baseUrl
        + '/room/reservation/v1?checkin=' + this.currCheckInVal
        + '&checkout=' + this.currCheckOutVal );
    }



}

export interface Roomsearch {
  checkin: string;
  checkout: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  price: string;
  links: string;
}

export class RoomRequest {
  roomId: string;
  checkin: string;
  checkout: string;

  constructor(roomId: string, checkin: string, checkout: string) {
    this.roomId = roomId;
    this.checkin = checkin;
    this.checkout = checkout;
  }
}
