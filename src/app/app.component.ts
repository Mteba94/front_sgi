import { Component, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { ConfigService } from '../@vex/services/config.service';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from '../@vex/services/navigation.service';

import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Style, StyleService } from '../@vex/services/style.service';
import { ConfigName } from '../@vex/interfaces/config-name.model';
import { IconsService } from '@shared/services/icons.service';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vex';

  constructor(private configService: ConfigService,
    private styleService: StyleService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private route: ActivatedRoute,
    private navigationService: NavigationService) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    this.configService.updateConfig({
      sidenav: {
        title: "SGI",
        imageUrl: "/assets/img/demo/LogoParroquial.png",
        showCollapsePin: true,
      },
    });

    this.route.queryParamMap.pipe(
      map(queryParamMap => queryParamMap.has('rtl') && coerceBooleanProperty(queryParamMap.get('rtl'))),
    ).subscribe(isRtl => {
      this.document.body.dir = isRtl ? 'rtl' : 'ltr';
      this.configService.updateConfig({
        rtl: isRtl
      });
    });

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('layout'))
    ).subscribe(queryParamMap => this.configService.setConfig(queryParamMap.get('layout') as ConfigName));

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('style'))
    ).subscribe(queryParamMap => this.styleService.setStyle(queryParamMap.get('style') as Style));


    this.navigationService.items = [
      {
        type: 'link',
        label: 'Estadísticas',
        route: 'estadisticas',
        icon: IconsService.prototype.getIcon("icDashboard")
      },
      {
        type: 'link',
        label: 'Tipo de Sacramento',
        route: 'tipoSacramento',
        icon: IconsService.prototype.getIcon("icCategory")
      },
      {
        type: 'link',
        label: 'Sacramentos',
        route: 'sacramento',
        icon: IconsService.prototype.getIcon("icProvider")
      },
      {
        type: 'link',
        label: 'Constancias',
        route: 'constancias',
        icon: IconsService.prototype.getIcon("icCloudDownload")
      }
    ];
  }
}