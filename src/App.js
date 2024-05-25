import React, { useState, useEffect } from 'react';
import api from './api';
import './scrollbar.css';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const App = () => {
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [fromData, setFromData] = useState({
    amount: '',
    category_id: '',
    date: '',
    description: '',
    is_income: false,
  });
  
  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    // Преобразуем список категорий в объект, где ключом будет id, а значением - имя категории
    const categoriesMap = categories.reduce((map, category) => {
      map[category.id] = category.name;
      return map;
    }, {});
    setCategoryMap(categoriesMap);
  }, [categories]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await api.get('/user/');
        setUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
  
  const fetchTransactions = async () => {
    if (userId) {
      const response = await api.get('/transactions/', {
        headers: { 'X-User-ID': userId }
      });
      setTransactions(response.data);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  useEffect(() => {
    const fetchExpensesByCategory = async () => {
      if (userId) {
        const response = await api.get('/expenses_by_category/', {
          headers: { 'X-User-ID': userId }
        });
        setExpensesByCategory(response.data);
      }
    };
    fetchExpensesByCategory();
  }, [userId]);

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    if (event.target.name === 'category') {
      // Найдем выбранную категорию по ее названию и установим id
      const selectedCategory = categories.find(category => category.name === value);
      if (selectedCategory) {
        setFromData({ ...fromData, category_id: selectedCategory.id });
      }
    } else {
      setFromData({ ...fromData, [event.target.name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userId) {
      const response = await api.post('/transactions/', { 
        amount: fromData.amount,
        category_id: fromData.category_id, // Используем category_id вместо category
        description: fromData.description,
        is_income: fromData.is_income,
        date: fromData.date,
      }, {
        headers: { 'X-User-ID': userId }
      });
      setTransactions([...transactions, response.data]);
      setFromData({
        amount: '',
        category_id: '',
        date: '',
        description: '',
        is_income: false,
      });
      updateChartData();
    }
  };

  const updateChartData = async () => {
    if (userId) {
      const response = await api.get('/expenses_by_category/', {
        headers: { 'X-User-ID': userId }
      });
      setExpensesByCategory(response.data);
    }
  };


  return (

    // верхняя менюшка
    
    <div style={{ backgroundColor: '#242b47', minHeight: '100vh' }}>
  <nav class="navbar navbar-dark" style={{ backgroundColor: '#181f38' }}>
    <div className='container-fluid'>
      <a className='navbar-brand' href='google.com'>
        CashFlow
      </a>
    </div>
  </nav>

  {/* Блок для добавления транзакций и блок с историей транзакций */}
  <div className='container'>
    <div className='row'>
      {/* Блок для добавления транзакций */}
      <div className='col-12 col-md-4 mx-auto my-2'>
        <div className='transaction-block border rounded-3 p-3 mt-3' style={{ height: '570px' }}>
          <h2 className='text-white mb-3'>Добавить транзакцию</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='amount' className='form-label' style={{ color: 'white' }}>
                Amount
              </label>
              <input type='text' className='form-control' id='amount' name='amount' value={fromData.amount} onChange={handleInputChange} />
            </div>
                <div className='mb-3'>
                  <label htmlFor='category_id' className='form-label' style={{ color: 'white' }}>
                    Category
                  </label>
                  {/* Используем выпадающий список для категорий */}
                  <select className='form-control' id='category_id' name='category_id' value={fromData.category_id} onChange={handleInputChange}>
                    <option value=''>Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='mb-3'>
                  <label htmlFor='description' className='form-label' style={{ color: 'white' }}>
                    Description
                  </label>
                  <input type='text' className='form-control' id='description' name='description' value={fromData.description} onChange={handleInputChange} />
                </div>

                <div className='mb-3'>
                  <div className='form-check'>
                    <input type='checkbox' className='form-check-input' id='is_income' name='is_income' checked={fromData.is_income} onChange={handleInputChange} />
                    <label className='form-check-label' htmlFor='is_income' style={{ color: 'white' }}>
                      Income?
                    </label>
                  </div>
                </div>

                <div className='mb-3'>
                  <label htmlFor='date' className='form-label' style={{ color: 'white' }}>
                    Date
                  </label>
                  <input type='text' className='form-control' id='date' name='date' value={fromData.date} onChange={handleInputChange} />
                </div>
            <button type='submit' className='btn btn-light' style={{ backgroundColor: '#FDBF50' }}>
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Блок с историей транзакций */}
      <div className='col-12 col-md-6 mx-auto my-2'>
        <div className='transaction-block border rounded-3 p-3 mt-3' style={{ height: '570px' }}>
          <h2 className='text-white mb-3'>История транзакций</h2>
          <div className="table-responsive" style={{ maxHeight: '90%', overflowY: 'auto' }}>
            <table className='table table-striped table-bordered table-hover mt-3'>
              <thead>
                <tr style={{ color: 'white' }}>
                  <th>Amount</th>
                  <th>Category</th>
                  {/* <th>Description</th> */}
                  <th>Income?</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} style={{ color: 'white' }}>
                    <td>{transaction.amount}</td>
                    <td>{categoryMap[transaction.category_id]}</td>
                    {/* <td>{transaction.description}</td> */}
                    <td>{transaction.is_income ? 'Yes' : 'No'}</td>
                    <td>{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Блок с диаграммами Сферы затрат */}
      <div className='col-12 col-md-6 mx-auto my-2'>
        <div className='transaction-block border rounded-3 p-4 mt-3' style={{ height: '570px' }}>
          <h2 className='text-white mb-3'>Сферы затрат</h2>
          <div className="d-flex justify-content-center" style={{ maxWidth: '100%', maxHeight: '400px' }}>
            <Doughnut data={{
              labels: Object.keys(expensesByCategory),
              datasets: [{
                data: Object.values(expensesByCategory),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#00FF7F'], // Можно указать любые цвета для разных категорий
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#00FF7F']
              }]
            }}
             />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default App;
