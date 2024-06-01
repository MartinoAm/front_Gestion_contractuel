import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Etablissement } from '../../models/etablissement';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-etablissement',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  host: { ngSkipHydration: 'true' },
  templateUrl: './etablissement.component.html',
  styleUrl: './etablissement.component.css'
})
export class EtablissementComponent implements OnInit {

  titre = "Liste de l'etablissement dans la region";

  etablissement: Etablissement = {
    id_etab: '',
    nom_etab: '',
    adress_etab: ''
  }

  etab: Etablissement = {
    id_etab: '',
    nom_etab: '',
    adress_etab: ''
  }

  id_pack: any = [];
  idx = "";

  etabListe: Etablissement[] = [];

  constructor(private http: HttpClient) {
    this.getAllEtabListe();
  }

  getAllEtabListe(): void {
    this.http.get("http://localhost:3001/api/etablissement/").subscribe((dataListe: any) => {
      this.etabListe = dataListe;
    });
  }

  addEtablissement(): void {

    if (this.etablissement.nom_etab === "" || this.etablissement.adress_etab === "") {
      Swal.fire({
        icon: "warning",
        title: "ERREUR",
        text: "Verifier les champs, Les champs n'ont pas etre vide!"
      });
    } else {


      const data = {
        id_etab: null,
        nom_etab: this.etablissement.nom_etab,
        adress_etab: this.etablissement.adress_etab
      }
      this.http.post('http://localhost:3001/api/etablissement/add', data).subscribe(
        (reponse) => {
          this.getAllEtabListe();
          Swal.fire(
            {
              icon: 'success',
              title: "Success !",
              text: 'Operation effectuee avec success!',

            });
          this.etablissement = {
            id_etab: "",
            nom_etab: "",
            adress_etab: ""
          }
        },
        (erreur: any) => {
          Swal.fire({
            icon: 'error',
            title: "Erreur",
            text: "Erreur! Operation Fatal !"
          });
        }
      );
    }
  }


  setUpdate(index: any) {
    this.etab = { ...this.etabListe[index] };
    this.idx = this.etab.id_etab;

    console.log(this.etab);
    console.log(this.idx);

  }

  update(): void {
    let data = this.etab;
    if (this.etab.id_etab === "" || this.etab.nom_etab === "" || this.etab.adress_etab === "") {
      Swal.fire({
        icon: "warning",
        title: "UPDATE ERROR",
        text: 'Remplir tous les champs'
      });
    } else {
      this.http.put('http://localhost:3001/api/etablissement/update/' + this.idx, data).subscribe(
        (erreur) => {
          Swal.fire({
            icon: "warning",
            title: "UPDATE ERROR",
            text: 'Erreur lors de mise a jour de donnee'
          });
        },
        (response) => {
          this.getAllEtabListe();
          Swal.fire({
            icon: "success",
            title: "UPDATE SUCCESS",
            text: 'Mise a jour de donnee de l\'etablissement reussi'
          });
        });
    }
  };

  delete(id: number): void {
    for (let i = 0; i < this.id_pack.length; i++) {
      this.idx = this.id_pack[id];
    }
    this.http.delete('http://localhost:3001/api/etablissement/delete/' + this.idx).subscribe(
      (erreur) => {
        Swal.fire({
          icon: "warning",
          title: "DELETE ERROR",
          text: "Serveur echoue"
        });
      }, (response) => {
        this.getAllEtabListe();
        Swal.fire({
          icon: "success",
          title: "DELETE SUCCESS",
          text: "Suppression de Donnee effectue"
        });
      }
    );
  }

  ngOnInit(): void {
    for (let i = 0; i < this.etabListe.length; i++) {
      const e = this.etabListe[i].id_etab;
      this.id_pack.push(e);
    }
  }
}
