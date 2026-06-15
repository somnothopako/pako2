import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ChevronLeft, Plus, Trash2, Undo, Redo } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { BubblesIcon } from '@/app/components/BubblesIcon';

interface BudgetEntry {
  id: string;
  category: string;
  description: string;
  amount: string;
  frequency: 'Once' | 'Monthly';
  status: 'Planned' | 'Spent';
}

export function MonthlyBudget() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<BudgetEntry[]>([
    {
      id: '1',
      category: 'Groceries',
      description: 'Weekly shopping',
      amount: '2000',
      frequency: 'Monthly',
      status: 'Spent',
    },
    {
      id: '2',
      category: 'Transport',
      description: 'Fuel & Uber',
      amount: '800',
      frequency: 'Monthly',
      status: 'Planned',
    },
    {
      id: '3',
      category: 'Entertainment',
      description: 'Netflix subscription',
      amount: '200',
      frequency: 'Monthly',
      status: 'Spent',
    },
  ]);

  // History for undo/redo
  const [history, setHistory] = useState<BudgetEntry[][]>([entries]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [bubblesInput, setBubblesInput] = useState('');
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof BudgetEntry } | null>(null);

  // Save state to history
  const saveToHistory = (newEntries: BudgetEntry[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newEntries);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setEntries(newEntries);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setEntries(history[historyIndex - 1]);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setEntries(history[historyIndex + 1]);
    }
  };

  // Add new entry
  const handleAddEntry = () => {
    const newEntry: BudgetEntry = {
      id: Date.now().toString(),
      category: '',
      description: '',
      amount: '',
      frequency: 'Monthly',
      status: 'Planned',
    };
    saveToHistory([...entries, newEntry]);
  };

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    saveToHistory(entries.filter(e => e.id !== id));
  };

  // Update entry field
  const handleUpdateField = (id: string, field: keyof BudgetEntry, value: string) => {
    const updatedEntries = entries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    saveToHistory(updatedEntries);
    setEditingCell(null);
  };

  // Toggle frequency
  const toggleFrequency = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      handleUpdateField(id, 'frequency', entry.frequency === 'Once' ? 'Monthly' : 'Once');
    }
  };

  // Toggle status
  const toggleStatus = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      handleUpdateField(id, 'status', entry.status === 'Planned' ? 'Spent' : 'Planned');
    }
  };

  // Ask Bubbles - Simple AI parsing
  const handleBubblesSubmit = () => {
    const input = bubblesInput.toLowerCase().trim();
    
    // Simple pattern matching for demo
    if (input.includes('add') || input.includes('create')) {
      // Extract category and amount
      const amountMatch = input.match(/r?\s?(\d+)/);
      const amount = amountMatch ? amountMatch[1] : '';
      
      // Try to identify category
      let category = '';
      if (input.includes('groceries') || input.includes('grocery')) category = 'Groceries';
      else if (input.includes('transport') || input.includes('fuel') || input.includes('uber')) category = 'Transport';
      else if (input.includes('entertainment') || input.includes('netflix')) category = 'Entertainment';
      else if (input.includes('gym') || input.includes('fitness')) category = 'Gym';
      else if (input.includes('rent') || input.includes('housing')) category = 'Rent';
      else category = 'Other';

      const newEntry: BudgetEntry = {
        id: Date.now().toString(),
        category,
        description: '',
        amount,
        frequency: 'Monthly',
        status: 'Planned',
      };
      saveToHistory([...entries, newEntry]);
      setBubblesInput('');
    } else if (input.includes('remove') || input.includes('delete')) {
      // Try to identify category to remove
      let categoryToRemove = '';
      if (input.includes('groceries') || input.includes('grocery')) categoryToRemove = 'Groceries';
      else if (input.includes('gym') || input.includes('fitness')) categoryToRemove = 'Gym';
      else if (input.includes('entertainment') || input.includes('netflix')) categoryToRemove = 'Entertainment';

      if (categoryToRemove) {
        const filtered = entries.filter(e => 
          e.category.toLowerCase() !== categoryToRemove.toLowerCase()
        );
        saveToHistory(filtered);
        setBubblesInput('');
      }
    }
  };

  // Calculate totals
  const totalBudget = entries.reduce((sum, entry) => {
    const amount = parseFloat(entry.amount) || 0;
    return sum + amount;
  }, 0);

  const totalSpent = entries
    .filter(e => e.status === 'Spent')
    .reduce((sum, entry) => {
      const amount = parseFloat(entry.amount) || 0;
      return sum + amount;
    }, 0);

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-6">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/finances')}
                className="mr-3"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Monthly Budget</h1>
                <p className="text-sm text-muted-foreground">Plan and track your spending for this month</p>
              </div>
            </div>

            {/* Undo/Redo Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="h-9 w-9"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                className="h-9 w-9"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 max-w-6xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-2xl font-bold text-primary">R{totalBudget.toLocaleString()}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">R{totalSpent.toLocaleString()}</p>
          </Card>
        </div>

        {/* Budget Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm w-[20%]">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm w-[30%]">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm w-[15%]">Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm w-[15%]">Frequency</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm w-[15%]">Status</th>
                  <th className="py-3 px-4 w-[5%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entries.map((entry) => (
                  <tr key={entry.id} className="group hover:bg-muted/50 transition-colors">
                    {/* Category */}
                    <td className="py-3 px-4">
                      {editingCell?.id === entry.id && editingCell?.field === 'category' ? (
                        <Input
                          autoFocus
                          value={entry.category}
                          onChange={(e) => {
                            const updated = entries.map(item =>
                              item.id === entry.id ? { ...item, category: e.target.value } : item
                            );
                            setEntries(updated);
                          }}
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingCell(null);
                            }
                          }}
                          className="h-8 text-sm"
                        />
                      ) : (
                        <div
                          onClick={() => setEditingCell({ id: entry.id, field: 'category' })}
                          className="cursor-pointer hover:bg-muted/30 rounded px-2 py-1 min-h-[32px] flex items-center"
                        >
                          {entry.category || <span className="text-muted-foreground">Click to edit</span>}
                        </div>
                      )}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4">
                      {editingCell?.id === entry.id && editingCell?.field === 'description' ? (
                        <Input
                          autoFocus
                          value={entry.description}
                          onChange={(e) => {
                            const updated = entries.map(item =>
                              item.id === entry.id ? { ...item, description: e.target.value } : item
                            );
                            setEntries(updated);
                          }}
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingCell(null);
                            }
                          }}
                          className="h-8 text-sm"
                        />
                      ) : (
                        <div
                          onClick={() => setEditingCell({ id: entry.id, field: 'description' })}
                          className="cursor-pointer hover:bg-muted/30 rounded px-2 py-1 min-h-[32px] flex items-center"
                        >
                          {entry.description || <span className="text-muted-foreground">Click to edit</span>}
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right">
                      {editingCell?.id === entry.id && editingCell?.field === 'amount' ? (
                        <Input
                          autoFocus
                          type="number"
                          value={entry.amount}
                          onChange={(e) => {
                            const updated = entries.map(item =>
                              item.id === entry.id ? { ...item, amount: e.target.value } : item
                            );
                            setEntries(updated);
                          }}
                          onBlur={() => setEditingCell(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingCell(null);
                            }
                          }}
                          className="h-8 text-sm text-right"
                        />
                      ) : (
                        <div
                          onClick={() => setEditingCell({ id: entry.id, field: 'amount' })}
                          className="cursor-pointer hover:bg-muted/30 rounded px-2 py-1 min-h-[32px] flex items-center justify-end font-semibold"
                        >
                          {entry.amount ? `R${parseFloat(entry.amount).toLocaleString()}` : <span className="text-muted-foreground">R0</span>}
                        </div>
                      )}
                    </td>

                    {/* Frequency */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFrequency(entry.id)}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 transition-colors"
                      >
                        {entry.frequency}
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleStatus(entry.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          entry.status === 'Spent'
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {entry.status}
                      </button>
                    </td>

                    {/* Delete */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Add New Row */}
                <tr className="hover:bg-muted/30 transition-colors">
                  <td colSpan={6} className="py-3 px-4">
                    <button
                      onClick={handleAddEntry}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New entry</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Ask Bubbles - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BubblesIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1 flex gap-2">
              <Input
                value={bubblesInput}
                onChange={(e) => setBubblesInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleBubblesSubmit();
                  }
                }}
                placeholder='Ask Bubbles to help... e.g., "Add groceries budget of R2,000"'
                className="flex-1"
              />
              <Button onClick={handleBubblesSubmit} disabled={!bubblesInput.trim()}>
                Send
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 ml-13">
            Try: "Add [category] budget of R[amount]" or "Remove [category]"
          </p>
        </div>
      </div>
    </div>
  );
}