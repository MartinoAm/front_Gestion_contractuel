import { Component, OnInit } from '@angular/core';
import { Contrat } from '../../models/contrat';
import { Agent } from '../../models/agent';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contrat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contrat.component.html',
  styleUrl: './contrat.component.css'
})
export class ContratComponent implements OnInit {
  headerContent = "contrat personnelle publique";

  contrat: Contrat = {
    code_contrat: '',
    matricule: '',
    grade: "",
    type_contrat: '',
    refdoss: '',
    datecontrat: ''
  }

  agent: Agent[] = [];
  contratItems: Contrat[] = [];
  matriculeVerify: any[] = [];
  matriculeContratverify: any[] = [];
  contratSearch: any = null;

  matricule: string = '';

  constructor(private http: HttpClient) {
    this.getContrat();
    this.getAgentAll();
  }


  getAgentAll(): void {
    this.http.get('http://localhost:3001/api/agent').subscribe((data: any) => {
      this.agent = data;
    });
  };

  getContrat(): void {
    this.http.get("http://localhost:3001/api/contrat").subscribe((dataListe: any) => {
      this.contratItems = dataListe;
    });
  }

  searchData(): void {
    let x = 0;
    for (let i = 0; i < this.matriculeContratverify.length; i++) {
      if (this.matricule == this.matriculeContratverify[i]) {
        x += 1;
      }
    }

    if (this.matricule === "") {
      Swal.fire({
        icon: "warning",
        title: "SEARCH ERROR",
        text: "Saisir un matricule s'il vous plait!"
      });
    } else {
      if (x != 0) {
        this.http.get('http://localhost:3001/api/contrat/search/' + this.matricule).subscribe((data: any) => {
          this.contratSearch = data;
        });

      } else {
        Swal.fire({
          icon: "warning",
          title: "SEARCH ERROR",
          text: "Matricule non trouve .... veuillez ressayer!!"
        });
      }
    }
    console.log(this.contratSearch);

  }

  saveNewContrat(): void {
    let data = this.contrat;
    let x = 0;
    let xSave = -1;

    for (let i = 0; i < this.matriculeVerify.length; i++) {
      if (this.contrat.matricule == this.matriculeVerify[i]) {
        x += 1;
      }
    }

    for (let i = 0; i < this.matriculeContratverify.length; i++) {
      if (this.contrat.matricule == this.matriculeContratverify[i]) {
        xSave += 1;
      }
    }

    if (x == 0) {
      Swal.fire({
        icon: "warning",
        title: "ERREUR",
        text: "Le matricule n'existe pas, Veuillez verifier l'information !"
      });
    } else {
      if (xSave != -1) {
        Swal.fire({
          icon: "warning",
          title: "ERREUR",
          text: "Le matricule que vous avez saisir est deja appartient a un contrat de l'agent"
        });
      } else {
        if (this.contrat.code_contrat === "" || this.contrat.grade === "" || this.contrat.refdoss === "" || this.contrat.type_contrat === "" || this.contrat.matricule === "" || this.contrat.datecontrat === "") {
          Swal.fire({
            icon: "warning",
            title: "ERREUR",
            text: "Veuillez verifier tous les champs , s'il vous plait... ! Remplissez tout les champs!"
          });
        } else {
          this.http.post("http://localhost:3001/api/contrat/add", data).subscribe(
            (erreur) => {
              Swal.fire({
                icon: "warning",
                title: "ERREUR AJOUTER",
                text: "Erreur de la serveur"
              });
            }, (respose) => {
              this.getContrat();
              Swal.fire({
                icon: "success",
                title: "SUCCESS",
                text: "Ajout de nouvelle contrat reussi avec success !"
              });
            });
        }
      }
    }
  }

  ngOnInit(): void {
    this.agent;
    for (let i = 0; i < this.agent.length; i++) {
      const element = this.agent[i].matricule;
      this.matriculeVerify.push(element);
    }

    for (let i = 0; i < this.contratItems.length; i++) {
      const element = this.contratItems[i].matricule;
      this.matriculeContratverify.push(element);
    }

  }

}
