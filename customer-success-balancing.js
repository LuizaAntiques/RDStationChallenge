/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */

// Função que valida se o numero de CSs em abstenção é menor do que metade do total de CSs
function validateAway(number, customerSuccessAway) {
  const maxAway = Math.floor(number / 2);

  if (customerSuccessAway.length > maxAway) {
    return customerSuccessAway.filter(c => customerSuccessAway.indexOf(c) < maxAway);
  }

  return customerSuccessAway
}

// Função para remover quem está de folga, férias ou licença, e retornar já ordenada
function removeAway(
  customerSuccess,
  customerSuccessAway
) {
  let list = customerSuccess.filter((cs) => !customerSuccessAway.includes(cs.id))

  return list.sort((a, b) => a.score - b.score);
}

// Função que percorre o array de clientes comparando o score deles com o score especifico de um CS
// e retorna uma lista de clientes sem os clientes que já deram match com algum CS e contagem de quantos clients deram match
function countAndDelete(customers, csScore) {
  let ids = [];
  let count = 0;

  customers.forEach((client) => {
    if (csScore >= client.score) {
      count ++;
      ids.push(client.id);
    }
  });

  const clientsList = customers.filter((c) => !ids.includes(c.id));
  
  return {
    clientsList,
    count
  };
}

// Função que percorre o array de CS passando seus scores como parametro para uma função de contagem
// e retorna um novo array com um numero de contagens incluido
function countClients(list, customers) {
  const csListCount = list.map((cs) => {
    const clientListAndCount = countAndDelete(customers, cs.score);
    customers = clientListAndCount.clientsList;

    return {
      id: cs.id,
      count: clientListAndCount.count,
    }
  });

  return csListCount;
}

// Função principal
function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
  ) {
    const csAway = validateAway(customerSuccess.length, customerSuccessAway)
    const csList = removeAway(customerSuccess, csAway);
    const listCustomersByCs = countClients(csList, customers)
      .sort((a, b) => b.count - a.count);

    if(listCustomersByCs[0].count === listCustomersByCs[1].count) {
      return 0;
    }

    return listCustomersByCs[0].id;
  }

// ---------------------------TESTES--------------------------------

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt){
  return Array.apply(0, Array(count)).map((it, index) => index + startAt)
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1))
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(999); // o CS com "id = 999" está como csAway.
  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});
