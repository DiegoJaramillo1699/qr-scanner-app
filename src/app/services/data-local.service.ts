import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import{File} from '@ionic-native/file/ngx'
@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];


  constructor(private storage: Storage,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private file: File) {
    this.storage.create();
    this.cargarRegistros();
   }

  async guardarRegistro(format: string, text: string){

      // en el caso poco probable de que se quiera acceder
      //a la info antes de ser cargada
      await this.cargarRegistros();

    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    console.log(this.guardados);
    this.storage.set('registros',this.guardados);

    this.abrirRegistro(nuevoRegistro);

  }

  async cargarRegistros(){

    await this.storage.get('registros').then( registros =>{
      this.guardados = registros || [];
    });

  }

  abrirRegistro(registro: Registro){

    this.navCtrl.navigateForward('/tabs/tab2');

    switch(registro.type){

      case 'http':
        //abrir el navegador web
        const browser = this.iab.create(registro.text,'_system');
        
      break;
      case 'geo':
        //abrir el navegador web
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        
      break;
    }

  }

  enviarCorreo(){

    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);

    this.guardados.forEach(registro =>{

      const linea = `${registro.type}, ${
        registro.format}, ${registro.created}, ${registro.text.replace(',', ' ')}\n`;

      arrTemp.push(linea);

    })

    //console.log(arrTemp.join(''));
    //this.crearArchivoFisico(arrTemp.join(''));

  }

  /* crearArchivoFisico(text: string){

    this.file.checkFile( this.file.dataDirectory, 'registros.csv' )
    .then(existe =>{

      console.log('Existe archivo', existe);
      return this.escribirEnArchivo(text);
    }).catch( err =>{

      return this.file.createFile(this.file.dataDirectory, 'registros.csv',false)
      .then( creado => this.escribirEnArchivo(text))
      .catch( err2 =>{
        console.log("No se pudo crear el archivo");
      });

    })

  }

  async escribirEnArchivo(text){

    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);
    console.log(this.file.dataDirectory + 'registros.csv');
  }
*/

}
