import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IconsService } from '@shared/services/icons.service';
import { SacramentoResponse } from 'src/app/pages/sacramento/models/sacramento-response.interface';
import { SacramentoService } from 'src/app/pages/sacramento/services/sacramento.service';
import { ConstanciaRequest } from '../../models/constancia-request.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstanciesService } from '../../services/constancies.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertService } from '@shared/services/alert.service';
import { HistConstanciaRequest } from '../../models/histConstancia-request.interface';
import { forkJoin } from 'rxjs';
import { SacerdoteResponse } from 'src/app/pages/sacerdotes/models/sacerdote-response.interface';
import { SacerdoteService } from 'src/app/pages/sacerdotes/services/sacerdote.service';

@Component({
  selector: "vex-constancies-manage",
  templateUrl: "./constancies-manage.component.html",
  styleUrls: ["./constancies-manage.component.scss"],
})
export class ConstanciesManageComponent implements OnInit {
  icClose = IconsService.prototype.getIcon("icClose");
  pdfSrc: SafeResourceUrl | null = null;
  fileName: string = null;
  tSacramento: string = null;
  tNombre: string = null;
  correlativo: string = null;
  sacerdote: SacerdoteResponse[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public _sacramentoService: SacramentoService,
    public _spinner: NgxSpinnerService,
    public _constanciaService: ConstanciesService,
    private sanitizer: DomSanitizer,
    private _alert: AlertService,
    private _sacerdoteService: SacerdoteService
  ) {}

  ngOnInit(): void {
    if (this.data != null) {
      //console.log(this.data)
      //console.log(this.data.scIdSacramento)
      this.constancesGenerate(this.data.scIdSacramento);
      this.firmaSelect();
    }
  }

  ngOnDestroy(): void {
    if (this.pdfSrc) {
      URL.revokeObjectURL(this.pdfSrc as string);
    }
  }

  generateCorrelativo(sacramentoId: number) {
    this._constanciaService
      .genarateCorrelativo(sacramentoId)
      .subscribe((resp) => {
        this.correlativo = resp.data;
      });
  }

  constancesGenerate(sacramentoId: number) {
    forkJoin({
      resp: this._sacramentoService.SacramentoById(sacramentoId),
      correlativo: this._constanciaService.genarateCorrelativo(sacramentoId),
    }).subscribe(({ resp, correlativo }) => {
      if (resp.scIdTipoSacramento == 4) {
        this.constancesMatrimonioGenerate(sacramentoId);
      }

      this.correlativo = correlativo.data;

      this.tSacramento = resp.scTipoSacramento;
      this.tNombre = resp.peNombre;

      const numeroPartida = resp.scNumeroPartida.trim();
      const [libro, folio, partida] = numeroPartida
        .split("-")
        .map((part) => part.trim());

      const libroNumero = libro.replace(/[^\d]/g, "");
      const folioNumero = folio.replace(/[^\d]/g, "");
      const partidaNumero = partida.replace(/[^\d]/g, "");

      const fechaSacramento = resp.scFechaSacramento;
      const fecha = new Date(fechaSacramento);

      const dia = fecha.getDate();
      const mesNumero = fecha.getMonth();
      const anio = fecha.getFullYear();

      const fechaActual = new Date();

      const diaAct = fechaActual.getDate();
      const mesAct = fechaActual.getMonth();
      const aniAct = fechaActual.getFullYear();

      const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      const mesLetraAct = meses[mesAct];
      const mesLetra = meses[mesNumero];

      const fechaNacimiento = new Date(resp.peFechaNacimiento);

      const diaNac = fechaNacimiento.getDate().toString().padStart(2, "0");
      const mesNac = (fechaNacimiento.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const añoNac = fechaNacimiento.getFullYear();

      const fechaFormateadaNac = `${diaNac}/${mesNac}/${añoNac}`;

      const nombrePadrinos = [resp.scNombrePadrino, resp.scNombreMadrina];

      let edad = fecha.getFullYear() - fechaNacimiento.getFullYear();
      const mes = fecha.getMonth() - fechaNacimiento.getMonth();

      if (
        mes < 0 ||
        (mes === 0 && fecha.getDate() < fechaNacimiento.getDate())
      ) {
        edad--;
      }

      this._sacerdoteService
        .SacerdoteById(resp.scParrocoId)
        .subscribe((respSacerdote) => {
          let nombreSacerdote = respSacerdote.sacerdoteNombre;

          const constaciaData: ConstanciaRequest = {
            idTipoSacramento: resp.scIdTipoSacramento,
            tipoSacramento: resp.scTipoSacramento,
            numero: libroNumero,
            folio: folioNumero,
            partida: partidaNumero,
            correlativo: this.correlativo,
            dia: dia.toString(),
            mes: mesLetra,
            anio: anio.toString(),
            nombreBautizado: resp.peNombre,
            nombreEsposa: "",
            fechaNacimiento: fechaFormateadaNac,
            fechaNacimientoEsposa: "",
            edad: edad,
            nombrePadre: resp.scNombrePadre,
            nombrePadreEsposa: "",
            nombreMadre: resp.scNombreMadre,
            nombreMadreEsposa: "",
            nombrePadrinos: nombrePadrinos,
            nombreSacerdote: nombreSacerdote,
            sacerdoteRealizaCat: respSacerdote.sacerdoteCategoria,
            anotacionMarginal: resp.scObservaciones,
            diaExpedicion: diaAct.toString(),
            mesExpedicion: mesLetraAct,
            anioExpedicion: aniAct.toString(),
            sacerdoteFirma: this.sacerdote[0].sacerdoteNombre,
            sacerdoteCat: this.sacerdote[0].sacerdoteCategoria,
            tituloSacerdotal: this.data.tituloSacerdotal,
          };

          this._spinner.show();
          this._constanciaService.constancieGenerate(constaciaData).subscribe(
            (respConst) => {
              this._spinner.hide();

              const base64Data = respConst.data.b64;
              const fileNameData = respConst.data.fileName;

              const binary = atob(base64Data.replace(/\s/g, ""));
              const len = binary.length;
              const buffer = new ArrayBuffer(len);
              const view = new Uint8Array(buffer);
              for (let i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
              }
              const blob = new Blob([view], { type: "application/pdf" });

              const url = URL.createObjectURL(blob);
              this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
              this.fileName = fileNameData;
            },
            (error) => {
              console.error("Error al generar la constancia: ", error);
              this._spinner.hide();
            }
          );
        });
    });
  }

  constancesMatrimonioGenerate(sacramentoId: number) {
    forkJoin({
      resp: this._sacramentoService.MatrimonioById(sacramentoId),
      correlativo: this._constanciaService.genarateCorrelativo(sacramentoId),
    }).subscribe(({ resp, correlativo }) => {
      this.correlativo = correlativo.data;

      this.tSacramento = "Matrimonio";
      this.tNombre = resp.peNombreEsposo + " con " + resp.peNombreEsposa;

      const numeroPartida = resp.scNumeroPartida.trim();
      const [libro, folio, partida] = numeroPartida
        .split("-")
        .map((part) => part.trim());

      const libroNumero = libro.replace(/[^\d]/g, "");
      const folioNumero = folio.replace(/[^\d]/g, "");
      const partidaNumero = partida.replace(/[^\d]/g, "");

      const fechaSacramento = resp.scFechaSacramento;
      const fecha = new Date(fechaSacramento);

      const dia = fecha.getDate();
      const mesNumero = fecha.getMonth();
      const anio = fecha.getFullYear();

      const fechaActual = new Date();

      const diaAct = fechaActual.getDate();
      const mesAct = fechaActual.getMonth();
      const aniAct = fechaActual.getFullYear();

      const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      const mesLetraAct = meses[mesAct];
      const mesLetra = meses[mesNumero];

      const fechaNacimiento = new Date(resp.peFechaNacimientoEsposo);

      const diaNac = fechaNacimiento.getDate().toString().padStart(2, "0");
      const mesNac = (fechaNacimiento.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const añoNac = fechaNacimiento.getFullYear();

      const fechaFormateadaNac = `${diaNac}/${mesNac}/${añoNac}`;

      const nombrePadrinos = [resp.scTestigo1, resp.scTestigo2];

      let edad = fecha.getFullYear() - fechaNacimiento.getFullYear();
      const mes = fecha.getMonth() - fechaNacimiento.getMonth();

      if (
        mes < 0 ||
        (mes === 0 && fecha.getDate() < fechaNacimiento.getDate())
      ) {
        edad--;
      }

      this._sacerdoteService
        .SacerdoteById(resp.scParrocoId)
        .subscribe((respSacerdote) => {
          
        

      const constaciaData: ConstanciaRequest = {
        idTipoSacramento: resp.scIdTipoSacramento,
        tipoSacramento: "Matrimonio",
        numero: libroNumero,
        folio: folioNumero,
        partida: partidaNumero,
        correlativo: this.correlativo,
        dia: dia.toString(),
        mes: mesLetra,
        anio: anio.toString(),
        nombreBautizado: resp.peNombreEsposo,
        nombreEsposa: resp.peNombreEsposa,
        fechaNacimiento: fechaFormateadaNac,
        fechaNacimientoEsposa: "",
        edad: edad,
        nombrePadre: resp.scPadreEsposo,
        nombrePadreEsposa: resp.scPadreEsposa,
        nombreMadre: resp.scMadreEsposo,
        nombreMadreEsposa: resp.scMadreEsposa,
        nombrePadrinos: nombrePadrinos,
        nombreSacerdote: respSacerdote.sacerdoteNombre,
        sacerdoteRealizaCat: respSacerdote.sacerdoteCategoria,
        anotacionMarginal: resp.scObservaciones,
        diaExpedicion: diaAct.toString(),
        mesExpedicion: mesLetraAct,
        anioExpedicion: aniAct.toString(),
        sacerdoteFirma: this.sacerdote[0].sacerdoteNombre,
        sacerdoteCat: this.sacerdote[0].sacerdoteCategoria,
        tituloSacerdotal: this.data.tituloSacerdotal,
      };

      this._spinner.show();
      this._constanciaService.constancieGenerate(constaciaData).subscribe(
        (respConst) => {
          this._spinner.hide();

          const base64Data = respConst.data.b64;
          const fileNameData = respConst.data.fileName;

          const binary = atob(base64Data.replace(/\s/g, ""));
          const len = binary.length;
          const buffer = new ArrayBuffer(len);
          const view = new Uint8Array(buffer);
          for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([view], { type: "application/pdf" });

          const url = URL.createObjectURL(blob);
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          this.fileName = fileNameData;
        },
        (error) => {
          console.error("Error al generar la constancia: ", error);
          this._spinner.hide();
        }
      );
    })
    });
  }

  downloadPdf(base64Data: string, fileName: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onDownload() {
    if (this.pdfSrc) {
      const link = document.createElement("a");

      // Convertir SafeResourceUrl a string
      const url = this.sanitizer.sanitize(
        SecurityContext.RESOURCE_URL,
        this.pdfSrc
      );

      if (url) {
        link.href = url;
        link.download = this.fileName;
        link.click();
      } else {
        console.error(
          "Error: la URL del PDF no es segura o no se pudo convertir a string."
        );
      }
    }

    const histConstancia: HistConstanciaRequest = {
      ct_SacramentoId: this.data.scIdSacramento,
      ct_correlativo: this.correlativo,
      ct_UsuarioId: 1,
    };

    this.histRegiter(histConstancia);
  }

  histRegiter(histConstancia: HistConstanciaRequest) {
    this._constanciaService
      .histConstanciaRegister(histConstancia)
      .subscribe((resp) => {
        if (resp.isSuccess) {
          this._alert.success("Exito", "Constancia generada correctamente");
        } else {
          this._alert.error("Error", "Error al generar la constancia");
        }
      });
  }

  firmaSelect() {
    this._constanciaService.firmaSelect().subscribe((resp) => {
      this.sacerdote = resp;
    });
  }
}
