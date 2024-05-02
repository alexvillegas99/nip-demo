export interface Menu {
  id: number;
  icon: string;
  name: string;
  route: string;
  isSelected: boolean;
  submenus?: subMenu[];
}

interface subMenu {
  icon: string;
  name: string;
  route: string;
  isSelected: boolean;
  submenus?: subSubMenu[];
}

interface subSubMenu {
  icon: string;
  name: string;
  route: string;
  isSelected?: boolean;
}
