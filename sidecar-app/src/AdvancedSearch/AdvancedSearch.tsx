import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { SideCarAdapter } from '../services/SideCarAdapter';
import type { ICondition } from '../models/ISailor';
import './AdvancedSearch.css';

type SourceType = 'sailors' | 'billets' | 'commands';

const ADV_COLUMNS: Record<SourceType, Array<{ key: string; label: string; type: 'text' | 'select' | 'date' | 'number'; values?: string[] }>> = {
  sailors: [
    { key: 'lastName',    label: 'Last Name',    type: 'text' },
    { key: 'firstName',   label: 'First Name',   type: 'text' },
    { key: 'rate',        label: 'Rate',         type: 'select', values: ['IT', 'CTN', 'YN'] },
    { key: 'payGrade',    label: 'Pay Grade',    type: 'select', values: ['E4', 'E5', 'E6', 'E7'] },
    { key: 'prd',         label: 'PRD',          type: 'date' },
    { key: 'eaos',        label: 'EAOS',         type: 'date' },
    { key: 'command',     label: 'Command',      type: 'select', values: ['USS EXAMPLE (CVN-00)', 'NAVSTA TESTPORT', 'NIOC DEMO', 'COMNAVPERSCOM HQ', 'USS PLACEHOLDER (DDG-00)'] },
    { key: 'uic',         label: 'UIC',          type: 'select', values: ['XXXXX', 'XXXX1', 'XXXX2', 'XXXX3', 'XXXX4'] },
    { key: 'billet',      label: 'Billet',       type: 'text' },
    { key: 'lastContact', label: 'Last Contact', type: 'date' },
    { key: 'prdTier',     label: 'PRD Status',   type: 'select', values: ['EXPIRED', 'CRITICAL', 'URGENT', 'WATCH', 'STABLE'] }
  ],
  billets: [
    { key: 'commandName', label: 'Command',   type: 'select', values: ['USS EXAMPLE (CVN-00)', 'NAVSTA TESTPORT', 'NIOC DEMO', 'COMNAVPERSCOM HQ', 'USS PLACEHOLDER (DDG-00)'] },
    { key: 'rate',        label: 'Rate',      type: 'select', values: ['IT', 'CTN', 'YN'] },
    { key: 'payGrade',    label: 'Pay Grade', type: 'select', values: ['E4', 'E5', 'E6', 'E7'] },
    { key: 'title',       label: 'Title',     type: 'text' },
    { key: 'filled',      label: 'Filled',    type: 'select', values: ['Yes', 'No'] }
  ],
  commands: [
    { key: 'name',        label: 'Name',        type: 'text' },
    { key: 'type',        label: 'Type',        type: 'select', values: ['Sea', 'Shore'] },
    { key: 'homeport',    label: 'Homeport',    type: 'text' },
    { key: 'billetCount', label: 'Billet Count',type: 'number' }
  ]
};

interface IAdvExample {
  label: string;
  desc: string;
  source: SourceType;
  conditions: Array<{ column: string; operator: string; value: string }>;
}

const ADV_EXAMPLES: IAdvExample[] = [
  {
    label: 'Find Critical Sailors',
    desc: 'All sailors with PRDs in the next 3 months',
    source: 'sailors',
    conditions: [{ column: 'prd', operator: 'within', value: '3' }]
  },
  {
    label: 'Sea Duty Sailors',
    desc: 'All IT sailors at Sea commands',
    source: 'sailors',
    conditions: [
      { column: 'rate', operator: 'equals', value: 'IT' },
      { column: 'command', operator: 'contains', value: 'USS' }
    ]
  },
  {
    label: 'Unfilled Billets',
    desc: 'All billets that are currently vacant',
    source: 'billets',
    conditions: [{ column: 'filled', operator: 'equals', value: 'No' }]
  },
  {
    label: 'Expired PRD',
    desc: 'All sailors whose PRD has expired',
    source: 'sailors',
    conditions: [{ column: 'prdTier', operator: 'equals', value: 'EXPIRED' }]
  },
  {
    label: 'Shore Commands',
    desc: 'All shore duty commands and their billet counts',
    source: 'commands',
    conditions: [{ column: 'type', operator: 'equals', value: 'Shore' }]
  },
  {
    label: 'Stale Contact',
    desc: 'Sailors with no contact in the last 2 months',
    source: 'sailors',
    conditions: [{ column: 'lastContact', operator: 'past', value: '2' }]
  }
];

const ADV_OPERATORS = {
  text: [
    { key: 'equals',   label: 'is' },
    { key: 'contains', label: 'contains' },
    { key: 'starts',   label: 'starts with' }
  ],
  select: [
    { key: 'equals', label: 'is' },
    { key: 'not',    label: 'is not' }
  ],
  date: [
    { key: 'before', label: 'is before' },
    { key: 'after',  label: 'is after' },
    { key: 'within', label: 'is within next' },
    { key: 'past',   label: 'was within last' }
  ],
  number: [
    { key: 'equals', label: 'equals' },
    { key: 'gt',     label: 'is greater than' },
    { key: 'lt',     label: 'is less than' }
  ]
};

export default function AdvancedSearch() {
  const [source, setSource] = useState<SourceType>('sailors');
  const [conditions, setConditions] = useState<Array<ICondition & { id: number }>>([]);
  const [nextId, setNextId] = useState(1);
  const [results, setResults] = useState<any[] | null>(null);

  const handleAddCondition = useCallback((preset?: Partial<ICondition>) => {
    const cols = ADV_COLUMNS[source];
    const defaultCol = cols[0];
    const opType = defaultCol.type;
    const defaultOp = ADV_OPERATORS[opType][0].key;
    
    setConditions(prev => [...prev, {
      id: nextId,
      column: preset?.column || defaultCol.key,
      operator: preset?.operator || defaultOp,
      value: preset?.value || ''
    }]);
    setNextId(n => n + 1);
  }, [nextId, source]);

  const handleRemoveCondition = (id: number) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  };

  const updateCondition = (id: number, field: keyof ICondition, value: string) => {
    setConditions(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newCond = { ...c, [field]: value };
      
      if (field === 'column') {
        const colDef = ADV_COLUMNS[source].find(col => col.key === value);
        if (colDef) {
          newCond.operator = ADV_OPERATORS[colDef.type][0].key;
          newCond.value = colDef.type === 'select' && colDef.values ? colDef.values[0] : '';
        }
      }
      return newCond;
    }));
  };

  const runQuery = async () => {
    const data = await SideCarAdapter.executeAdvancedSearch(source, conditions.map(({ id, ...rest }) => rest));
    setResults(data);
  };

  const handleSourceChange = (newSource: SourceType) => {
    setSource(newSource);
    setConditions([]);
    setResults(null);
  };

  const renderConditionValueInput = (cond: ICondition & { id: number }) => {
    const colDef = ADV_COLUMNS[source].find(c => c.key === cond.column);
    if (!colDef) return null;

    if (colDef.type === 'select') {
      return (
        <select 
          className="adv-cond-val" 
          value={cond.value}
          onChange={(e) => updateCondition(cond.id, 'value', e.target.value)}
        >
          {colDef.values?.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      );
    }

    if (colDef.type === 'date') {
      if (cond.operator === 'within' || cond.operator === 'past') {
        return (
          <>
            <input 
              type="number" className="adv-cond-val" style={{ width: 60 }} min="1" max="60"
              value={cond.value || '3'} 
              onChange={(e) => updateCondition(cond.id, 'value', e.target.value)} 
            /> 
            <span style={{ fontSize: 13, marginLeft: 6 }}>months</span>
          </>
        );
      }
      return (
        <input 
          type="date" className="adv-cond-val" 
          value={cond.value} 
          onChange={(e) => updateCondition(cond.id, 'value', e.target.value)} 
        />
      );
    }

    if (colDef.type === 'number') {
      return (
        <input 
          type="number" className="adv-cond-val" style={{ width: 80 }}
          value={cond.value} 
          onChange={(e) => updateCondition(cond.id, 'value', e.target.value)} 
        />
      );
    }

    return (
      <input 
        type="text" className="adv-cond-val" placeholder="value..." style={{ width: 140 }}
        value={cond.value} 
        onChange={(e) => updateCondition(cond.id, 'value', e.target.value)} 
      />
    );
  };

  return (
    <div className="adv-search-container">
      {/* Topbar */}
      <div className="adv-search-topbar">
        <Link to="/" className="adv-search-topbar__brand">
          SIDE<span className="adv-search-topbar__brand-accent">[CAR]</span>
        </Link>
        <div className="adv-search-topbar__search">
          <input type="text" placeholder="Describe what you're looking for..." />
        </div>
        <Link to="/" className="adv-search-topbar__back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </Link>
      </div>

      <div className="adv-search-body">
        {/* Left: Query Builder */}
        <div className="adv-query-panel">
          <div className="adv-query-panel__header">Query Builder</div>
          
          <div className="adv-query-builder">
            <div className="adv-query-sentence">
              Show me all{' '}
              <select value={source} onChange={(e) => handleSourceChange(e.target.value as SourceType)}>
                <option value="sailors">Sailors</option>
                <option value="billets">Billets</option>
                <option value="commands">Commands</option>
              </select>
            </div>

            <div id="adv-conditions">
              {conditions.map(cond => (
                <div key={cond.id} className="adv-condition-row">
                  <label>Where</label>
                  <select 
                    className="adv-cond-col" 
                    value={cond.column}
                    onChange={(e) => updateCondition(cond.id, 'column', e.target.value)}
                  >
                    {ADV_COLUMNS[source].map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>

                  <select 
                    className="adv-cond-op"
                    value={cond.operator}
                    onChange={(e) => updateCondition(cond.id, 'operator', e.target.value)}
                  >
                    {ADV_OPERATORS[ADV_COLUMNS[source].find(c => c.key === cond.column)?.type || 'text'].map(op => (
                      <option key={op.key} value={op.key}>{op.label}</option>
                    ))}
                  </select>

                  {renderConditionValueInput(cond)}

                  <button className="adv-condition-remove" onClick={() => handleRemoveCondition(cond.id)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="adv-btn-add-condition" onClick={() => handleAddCondition()}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Condition
          </button>

          <button className="adv-btn-run" onClick={runQuery}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Run Query
          </button>

          {/* Coaching / Examples */}
          <div className="adv-coaching">
            <div className="adv-coaching__title">Example Queries</div>
            <div className="adv-coaching__examples">
              {ADV_EXAMPLES.map((ex, i) => (
                <div
                  key={i}
                  className="adv-coaching__example"
                  onClick={() => {
                    setSource(ex.source);
                    const mapped = ex.conditions.map((c, idx) => ({
                      id: nextId + idx,
                      ...c,
                    }));
                    setConditions(mapped);
                    setNextId(nextId + mapped.length);
                    setResults(null);
                  }}
                >
                  <div className="adv-coaching__example-label">{ex.label}</div>
                  {ex.desc}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results Table */}
        <div className="adv-results-panel">
          <div className="adv-results-header">
            <span>Results &mdash; <span className="adv-results-count">{results ? results.length : 0} rows</span></span>
            {results && results.length > 0 && (
              <div className="adv-results-actions">
                 <button className="adv-action-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export Excel
                </button>
              </div>
            )}
          </div>
          
          <div className="adv-results-scroll">
            {!results ? (
              <div className="adv-results-empty">
                <div className="adv-results-empty__icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <div className="adv-results-empty__title">Build Your Query</div>
                <div className="adv-results-empty__desc">
                  Use the query builder on the left to filter data. Select conditions and click "Run Query" to see results. Or click an example below to get started.
                </div>
              </div>
            ) : results.length === 0 ? (
               <div className="adv-results-empty">
                <div className="adv-results-empty__title">No match found</div>
                <div className="adv-results-empty__desc">
                  Adjust your search conditions.
                </div>
              </div>
            ) : (
              <table className="adv-results-table">
                <thead>
                  <tr>
                    {ADV_COLUMNS[source].map(c => <th key={c.key}>{c.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.id || i}>
                      {ADV_COLUMNS[source].map(c => (
                        <td key={c.key}>{r[c.key]?.toString() || ''}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
