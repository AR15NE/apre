import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CallDurationByAgentComponent } from './call-duration-by-agent.component';

describe('CallDurationByAgentComponent', () => {
  let component: CallDurationByAgentComponent;
  let fixture: ComponentFixture<CallDurationByAgentComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CallDurationByAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallDurationByAgentComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const req = httpMock.expectOne('http://localhost:3000/api/reports/agent-performance/agents');
    expect(req.request.method).toEqual('GET');
    req.flush([]); // Return empty array

    expect(component).toBeTruthy();
  });

  it('should display the title "Agent Performance - Call Duration"', () => {
    const req = httpMock.expectOne('http://localhost:3000/api/reports/agent-performance/agents');
    expect(req.request.method).toEqual('GET');
    req.flush([]); // Return empty array

    fixture.detectChanges(); // Ensure DOM updates

    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1'); // Updated selector to match <h1>
    console.log('Title Element:', titleElement); // Log to check if element is found
    expect(titleElement).toBeTruthy();
    if (titleElement) {
      expect(titleElement.textContent).toContain('Agent Performance - Call Duration');
    }
  });

  it('should not submit the form if no agent is selected', () => {
    const req = httpMock.expectOne('http://localhost:3000/api/reports/agent-performance/agents');
    expect(req.request.method).toEqual('GET');
    req.flush([]); // Return empty array

    component.agentForm.setValue({ agent: null }); // Set form to expected structure with null value
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('form');
    console.log('Form Element:', formElement); // Log to check if form element is found
    expect(formElement).toBeTruthy(); // Ensure form element exists
    if (formElement) {
      formElement.dispatchEvent(new Event('submit'));
    }

    // Check that the form was not submitted
    expect(component.agentForm.valid).toBeFalsy();
  });

  it('should fetch performance data for selected agent', () => {
    const req = httpMock.expectOne('http://localhost:3000/api/reports/agent-performance/agents');
    expect(req.request.method).toEqual('GET');
    req.flush([]); // Return empty array

    // Add your test logic here for fetching performance data
    expect(component).toBeTruthy();
  });

  it('should initialize the agentForm with a null value', () => {
    const req = httpMock.expectOne('http://localhost:3000/api/reports/agent-performance/agents');
    expect(req.request.method).toEqual('GET');
    req.flush([]); // Return empty array

    expect(component.agentForm.value).toEqual({ agent: null });
  });
});
