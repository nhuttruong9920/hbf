import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PanelMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  panelItems: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setupPanelItems();
    this.initDefaultExpanded();
  }

  private initDefaultExpanded(): void {
    this.panelItems.forEach((panelItem) => {
      if (panelItem.items && panelItem.items.length > 0) {
        const level2Items = panelItem.items;
        level2Items.forEach((level2Item) => {
          const level2Link = `/admin/${level2Item.routerLink}`;
          if (level2Item.items && level2Item.items.length > 0) {
            const level3Items = level2Item.items;
            level3Items.forEach((level3Item) => {
              if (level3Item.routerLink === this.router.url) {
                level2Item.expanded = true;
                panelItem.expanded = true;
              }
            });
          } else if (level2Link === this.router.url) {
            panelItem.expanded = true;
          }
        });
      }
    });
  }

  setupPanelItems(): void {
    const orderMenu = {
      label: 'Đơn hàng',
      icon: 'fas fa-ballot-check',
      styleClass: 'sidenav-menu-level1',
      routerLink: 'order',
    };

    this.panelItems.push(orderMenu);

    const restaurantMenu: MenuItem = {
      label: 'Nhà hàng',
      icon: 'fas fa-fork-knife',
      styleClass: 'sidenav-menu-level1sub',
      items: [
        {
          label: 'Danh mục',
          icon: 'fas fa-suitcase',
          routerLink: 'category',
          styleClass: 'sidenav-menu-level2',
        },
        {
          label: 'Món ăn',
          icon: 'fas fa-burger-soda',
          routerLink: 'dish',
          styleClass: 'sidenav-menu-level2',
        },
      ],
    };

    this.panelItems.push(restaurantMenu);

    const userMenu = {
      label: 'Tài khoản',
      icon: 'fas fa-people-simple',
      styleClass: 'sidenav-menu-level1sub',
      items: [
        {
          label: 'Phân quyền',
          icon: 'fas fa-user-shield',
          routerLink: 'account/permission',
          styleClass: 'sidenav-menu-level2',
        },
        {
          label: 'Vai trò',
          icon: 'fas fa-user-tag',
          routerLink: 'account/role',
          styleClass: 'sidenav-menu-level2',
        },
        {
          label: 'Thành viên',
          icon: 'fas fa-user-vneck-hair',
          routerLink: 'account/user',
          styleClass: 'sidenav-menu-level2',
        },
      ],
    };

    this.panelItems.push(userMenu);
  }
}
