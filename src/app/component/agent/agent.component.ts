import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Agent } from '../../models/agent';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.css'
})
export class AgentComponent implements OnInit {
  title = "personne publique";



  agent: Agent = {
    matricule: "",
    nom_agent: '',
    prenom_agent: '',
    naissance: '',
    cin: '',
    adresse_agent: '',
    telephone: '',
    email: '',
    diplome: '',
    nom_poste: '',
    id_etab: ''
  }

  agents: Agent[] = [];
  matricule_pack: any = [];
  agent_search: Agent[] = [];

  X_matricule = '';
  search = '';


  constructor(private http: HttpClient) {
    this.getAllAgent();
  }

  searchAgent(): void {
    let x = 0;
    for (let i = 0; i < this.matricule_pack.length; i++) {
      if (this.search == this.matricule_pack[i]) {
        x += 1;
      }
    }
    if (this.search === "") {
      Swal.fire({
        icon: "warning",
        title: "SEARCH ERROR",
        text: "Saisir un matricule s'il vous plait!"
      });
    } else {
      if (x != 0) {
        this.http.get('http://localhost:3001/api/agent/search/' + this.search).subscribe((data: any) => {
          this.agent_search = data;
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "SEARCH ERROR",
          text: "Matricule non trouve .... veuillez ressayer!!"
        });
      }
    }
  }

  getAllAgent(): void {
    this.http.get('http://localhost:3001/api/agent').subscribe((data: any) => {
      this.agents = data;
    });
  }

  save(): void {
    const data = this.agent;
    let x = -1;

    for (let i = 0; i < this.matricule_pack.length; i++) {
      if (this.agent.matricule == this.matricule_pack[i]) {
        x += 1;
      }
    }

    if (x != 0) {
      if (
        this.agent.matricule === "" || this.agent.nom_agent === "" || this.agent.naissance === "" || this.agent.cin === "" ||
        this.agent.adresse_agent === "" || this.agent.telephone === "" || this.agent.email === "" || this.agent.diplome === "" || this.agent.nom_poste === "" || this.agent.id_etab === ""

      ) {
        Swal.fire({
          icon: "warning",
          title: 'ENREGISTREMENT ERREUR',
          text: "Verifiez tous les champs s'il vous plait! Seul le prenom a les droit d'etre vide!"
        });
      } else {
        this.http.post('http://localhost:3001/api/agent/add', data).subscribe(
          (response) => {
            this.getAllAgent();
            Swal.fire({
              icon: "success",
              title: "ENREGISTREMENT REUSSI",
              text: "L'enregistrement est reussi !"
            });

            this.agent = {
              matricule: "",
              nom_agent: '',
              prenom_agent: '',
              naissance: '',
              cin: '',
              adresse_agent: '',
              telephone: '',
              email: '',
              diplome: '',
              nom_poste: '',
              id_etab: ''
            }
          },
          (erreur) => {
            Swal.fire({
              icon: "warning",
              title: 'ENREGISTREMENT ERREUR',
              text: "Enregistrement n'est pas effectuer!"
            });
          });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: 'ENREGISTREMENT ERREUR',
        text: "Matricule deja exister, Verifiez tous les information!"
      });
    }
  }

  ngOnInit(): void {
    for (let i = 0; i < this.agents.length; i++) {
      const e = this.agents[i].matricule;
      this.matricule_pack.push(e);
    }
  }

}
