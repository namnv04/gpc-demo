import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { IRoute } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const testInput = [
    { from: 'A', to: 'B', distance: 5 },
    { from: 'B', to: 'C', distance: 4 },
    { from: 'C', to: 'D', distance: 8 },
    { from: 'D', to: 'C', distance: 8 },
    { from: 'D', to: 'E', distance: 6 },
    { from: 'A', to: 'D', distance: 5 },
    { from: 'C', to: 'E', distance: 2 },
    { from: 'E', to: 'B', distance: 3 },
    { from: 'A', to: 'E', distance: 7 },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('process', () => {
    it('works', () => {
      const mockThis = {
        getRouteDistance: (routeArray: IRoute[], route: string) => null,
        getTripsByNumberOfStops: (
          routeArray: IRoute[],
          from: string,
          to: string,
          min: number,
          max: number
        ) => null,
        getShortestDistance: (routeArray: IRoute[], from: string, to: string) =>
          null,
        getRoutesByDistanceLimit: (
          routeArray: IRoute[],
          from: string,
          to: string,
          limit: number
        ) => null,
      };
      spyOn(mockThis, 'getRouteDistance');
      spyOn(mockThis, 'getTripsByNumberOfStops');
      spyOn(mockThis, 'getShortestDistance');
      spyOn(mockThis, 'getRoutesByDistanceLimit');
      const routes: IRoute[] = component.process.bind(mockThis)(
        'AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7'
      );
      expect(routes).toEqual(testInput);
      expect(mockThis.getRouteDistance).toHaveBeenCalledTimes(5);
      expect(mockThis.getTripsByNumberOfStops).toHaveBeenCalledTimes(2);
      expect(mockThis.getShortestDistance).toHaveBeenCalledTimes(2);
      expect(mockThis.getRoutesByDistanceLimit).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRoutesByDistanceLimit', () => {
    it('The number of different routes from C to C with a distance of less than 30', () => {
      expect(
        component.getRoutesByDistanceLimit(testInput, 'C', 'C', 30)
      ).toEqual(5);
    });
  });

  describe('getTripsByNumberOfStops', () => {
    it('The number of trips starting at C and ending at C with a maximum of 3 stops', () => {
      expect(
        component.getTripsByNumberOfStops(testInput, 'C', 'C', 0, 3)
      ).toEqual(2);
    });
    it('The number of trips starting at A and ending at C with exactly 4 stops', () => {
      expect(
        component.getTripsByNumberOfStops(testInput, 'A', 'C', 4, 4)
      ).toEqual(2);
    });
    it('The number of trips starting at A and ending at C with exactly 4 stops', () => {
      expect(component.getTripsByNumberOfStops(testInput, 'A', 'C', 4)).toEqual(
        9
      );
    });
  });

  describe('getShortestDistance', () => {
    it('Return shortest distance from A to C', () => {
      expect(component.getShortestDistance(testInput, 'A', 'C')).toEqual(9);
    });
    it('Return shortest distance from A to E', () => {
      expect(component.getShortestDistance(testInput, 'A', 'E')).toEqual(7);
    });
  });

  describe('findRoutes', () => {
    it('Return all trips for ABC', () => {
      expect(component.findRoutes(testInput, ['A'], 'C')).toEqual([
        'ABC',
        'ADC',
        'AEBC',
        'ADEBC',
        'ABCDC',
        'ADCDEBC',
        'ADCEBC',
        'AEBCDC',
        'ADEBCDC',
      ]);
    });
    it('Return all trips for BB', () => {
      expect(component.findRoutes(testInput, ['B'], 'B')).toEqual(['BCEB']);
    });
  });

  describe('getRouteDistance()', () => {
    it('Return 9 for route ABC', () => {
      expect(component.getRouteDistance(testInput, 'ABC')).toEqual(9);
    });
    it('Return 5 for route AD', () => {
      expect(component.getRouteDistance(testInput, 'AD')).toEqual(5);
    });
    it('Return 13 for route ADC', () => {
      expect(component.getRouteDistance(testInput, 'ADC')).toEqual(13);
    });
    it('Return 22 for route AEBCD', () => {
      expect(component.getRouteDistance(testInput, 'AEBCD')).toEqual(22);
    });
    it('Return 0 for route AED', () => {
      expect(component.getRouteDistance(testInput, 'AED')).toEqual(0);
    });
  });
});
