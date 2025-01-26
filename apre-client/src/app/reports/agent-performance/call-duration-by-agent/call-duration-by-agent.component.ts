import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../../../shared/chart/chart.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-call-duration-by-agent',
  standalone: true,
  imports: [CommonModule, ChartComponent, ReactiveFormsModule],
  template: `
    <div [formGroup]="agentForm">
      <h1>Agent Performance - Call Duration</h1>
      <form class="agent-form" (ngSubmit)="onSubmit($event)">
        <div class="agent-form__group">
          <label class="agent-form__label" for="agent">Agent</label>
          <select class="select" formControlName="agent" id="agent" name="agent">
            <option *ngFor="let agent of agents" [value]="agent">{{ agent }}</option>
          </select>
        </div>
        <div class="agent-form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      <br />
      <div *ngIf="showChart" class="chart-container">
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Agent Performance'"
            [data]="performanceData"
            [labels]="agents">
          </app-chart>
        </div>
      </div>
    </div>
  `,
  styles: `
    .agent-form {
      width: 50%;
      background: #fff;
      border: 1px solid #ddd;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      box-sizing: border-box;
      margin: 20px 0;
      min-height: 200px;
      margin: 0 auto;
    }

    .agent-form__group {
      display: flex;
      gap: 10px;
    }

    .agent-form__label {
      padding-right: 10px;
    }

    .agent-form__actions .button {
      margin-top: 10%;
      width: 100%;
    }

    .chart-container {
      width: 50%;
      margin: 0 auto;
    }

    .chart-card {
      width: 100%;
      margin: 20px 0;
    }
  `
})
export class CallDurationByAgentComponent {
  // Performance data to be displayed in the chart
  performanceData: number[] = []; // Initially empty
  // List of agents
  agents: string[] = []; // Initially empty
  showChart: boolean = false; // Initially hidden

  // Define the form group with agent control
  agentForm = this.fb.group({
    agent: [null, Validators.required]
  });

  constructor(private http: HttpClient, private fb: FormBuilder) {
    console.log('Fetching agents...');
    this.http.get<string[]>(`${environment.apiBaseUrl}/reports/agent-performance/agents`).subscribe({
      next: (data: string[]) => {
        this.agents = data;
        console.log('Agents fetched:', this.agents); // Logs the fetched agents
      },
      error: (err) => {
        console.error('Error fetching agents:', err); // Logs any error that occurs while fetching agents
      }
    });
  }

  fetchPerformanceData() {
    const agent = this.agentForm.controls['agent'].value;
    if (agent) {
      // Fetch performance data from the API for the selected agent
      this.http.get(`${environment.apiBaseUrl}/reports/agent-performance/call-duration-by-agent/${agent}`).subscribe({
        next: (data: any) => {
          this.performanceData = data[0].callDurations;
          this.agents = data[0].agents;
          console.log('Performance data fetched:', data[0]); // Log the fetched data
        },
        error: (error: any) => {
          console.error('Error fetching call duration by agent data:', error);
        },
        complete: () => {
          this.showChart = true; // Show the chart after data is fetched
        }
      });
    } else {
      alert('Please select an agent.'); // Alert if no agent is selected
    }
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.log('Form submitted');
    this.fetchPerformanceData();
  }
}
