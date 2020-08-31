import { Component } from '@angular/core';

export interface IRoute {
  from: string;
  to: string;
  distance?: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {}
  inputData: string;
  file: any;
  output1: any;
  output2: any;
  output3: any;
  output4: any;
  output5: any;
  output6: any;
  output7: any;
  output8: any;
  output9: any;
  output10: any;
  submitted = false;

  /**
   * on user select a file
   */
  handleFileInput(e): void {
    this.file = e.item(0);
  }

  /**
   * Click submit and start processing
   */
  submit(): void {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.inputData = fileReader.result.toString();
      this.process(this.inputData);
      this.submitted = true;
    };
    fileReader.readAsText(this.file);
  }

  /**
   * Call individual methods and assign result to output props
   * @param data string content from text file
   */
  process(data: string): IRoute[] {
    const routeArray: IRoute[] = data.split(',').map((item) => {
      item = item.trim();
      const route: IRoute = {
        from: item[0],
        to: item[1],
        distance: Number(item[2]),
      };
      return route;
    });

    this.output1 = this.getRouteDistance(routeArray, 'ABC');
    this.output2 = this.getRouteDistance(routeArray, 'AD');
    this.output3 = this.getRouteDistance(routeArray, 'ADC');
    this.output4 = this.getRouteDistance(routeArray, 'AEBCD');
    this.output5 = this.getRouteDistance(routeArray, 'AED');
    this.output6 = this.getTripsByNumberOfStops(routeArray, 'C', 'C', 0, 3);
    this.output7 = this.getTripsByNumberOfStops(routeArray, 'A', 'C', 4, 4);
    this.output8 = this.getShortestDistance(routeArray, 'A', 'C');
    this.output9 = this.getShortestDistance(routeArray, 'B', 'B');
    this.output10 = this.getRoutesByDistanceLimit(routeArray, 'C', 'C', 30);
    return routeArray;
  }

  /**
   * Get all trips from two nodes that under max distance
   * @param routeArray route data
   * @param from one letter represent a from node
   * @param to one letter repsent a to node
   * @param maxDistance max distance
   */
  getRoutesByDistanceLimit(
    routeArray: IRoute[],
    from: string,
    to: string,
    maxDistance: number
  ): any {
    const allRoutes = this.findRoutes(routeArray, [from], to);
    const routesWithDistance = allRoutes.map((r) => {
      return {
        route: r,
        distance: this.getRouteDistance(routeArray, r),
      };
    });
    const routesByLimit = routesWithDistance.filter(
      (r) => r.distance < maxDistance
    );
    return routesByLimit.length;
  }

  /**
   * Return all routes that has number of stops within a given range
   * @param routeArray route data
   * @param from one letter represent a from node
   * @param to one letter repsent a to node
   * @param minStops min number of stops
   * @param maxStops max number of stops
   */
  getTripsByNumberOfStops(
    routeArray: IRoute[],
    from: string,
    to: string,
    minStops?: number,
    maxStops?: number
  ): any {
    let allRoutes = this.findRoutes(routeArray, [from], to);
    if (maxStops && minStops) {
      allRoutes = allRoutes.filter(
        (route) => route.length - 1 <= maxStops && route.length - 1 >= minStops
      );
    }
    if (maxStops) {
      allRoutes = allRoutes.filter((route) => route.length - 1 <= maxStops);
    }
    return allRoutes.length;
  }

  /**
   * Return shortest distance of the trip of a given two nodes
   * @param routeArray route data
   * @param from one letter represent a from node
   * @param to one letter repsent a to node
   */
  getShortestDistance(routeArray: IRoute[], from: string, to: string): any {
    const allRoutes = this.findRoutes(routeArray, [from], to);
    const routesWithDistance = allRoutes.map((r) =>
      this.getRouteDistance(routeArray, r)
    );
    return Math.min(...routesWithDistance);
  }

  /**
   * Supporting methods for findRoutes.
   * @param routeStrings
   * @param newRouteString
   */
  updateRouteStringsArray(
    routeStrings: string[],
    newRouteString: string
  ): string[] {
    let hasUpdated = false;
    routeStrings.forEach((item: string, index) => {
      if (newRouteString.includes(item) && !item.includes('_')) {
        routeStrings[index] = newRouteString;
        hasUpdated = true;
      }
    });
    if (hasUpdated === false) {
      routeStrings.push(newRouteString);
    }
    return routeStrings;
  }

  /**
   * Return all routes from two given nodes
   * @param routeArray route data
   * @param routeStrings Array of route strings, initialized with the starting node value
   * @param to one letter repsent a to node
   */
  findRoutes(routeArray: IRoute[], routeStrings: string[], to: string): any {
    const currentTotal = routeStrings.length;
    routeStrings.forEach((routeString) => {
      const from = routeString[routeString.length - 1];
      if (routeString.length > 1 && from === to) {
        routeStrings = this.updateRouteStringsArray(
          routeStrings,
          routeString + '_'
        );
      }
      routeArray.map((r) => {
        if (r.from === from && routeString.indexOf(from + r.to) < 0) {
          routeStrings = this.updateRouteStringsArray(
            routeStrings,
            routeString + r.to
          );
        }
      });
    });
    // console.log(routeStrings);
    let isDone = true;
    let i = 0;
    if (currentTotal === 1 || routeStrings.length > currentTotal) {
      while (i < routeStrings.length) {
        const lastNode = routeStrings[i][routeStrings[i].length - 1];
        const firstNode = routeStrings[i][0];
        if (lastNode !== to && lastNode !== firstNode) {
          isDone = false;
          break;
        }
        i++;
      }
    }

    if (isDone === false) {
      return this.findRoutes(routeArray, routeStrings, to);
    } else {
      return routeStrings
        .filter((item: string) => item.includes('_'))
        .map((item) => item.replace('_', ''));
    }
  }

  /**
   * Get distance of route
   * @param data array route object
   * @param route string represent a multi nodes routes
   */
  getRouteDistance(data: IRoute[], route: string): number {
    const routeNodes = route.split('');
    let totalDistance = 0;
    let hasNoRoute = false;
    const distance = routeNodes.reduce((prevValue, currentValue, index) => {
      const found = data.find(
        (r) => r.from === prevValue && r.to === currentValue
      );
      if (found) {
        totalDistance += found.distance;
      } else {
        hasNoRoute = true;
      }
      return currentValue;
    });
    return hasNoRoute ? 0 : totalDistance;
  }
}
