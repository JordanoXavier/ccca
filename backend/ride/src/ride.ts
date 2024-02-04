import pgp from "pg-promise";

interface position {
    lat: number;
    long: number;
}

export async function requestRide({passenger_id, position, destination}: {passenger_id: string, position: position, destination: position}) {
    // * deve verificar se o account_id tem is_passenger true
    // * deve verificar se já não existe uma corrida do passageiro em status diferente de "completed", se existir lançar um erro
    // * deve gerar o ride_id (uuid)
    // * deve definir o status como "requested"
    // * deve definir date com a data atual
    // * deve inserir a corrida no banco de dados
    // * deve retornar o ride_id
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
        return "ride_id";
    }
    finally {
        await connection.$pool.end();
    }
}

export async function getRide(rideId: string) {
    // * deve retornar todas as informações da ride juntamente com os dados do passageiro e do motorista (inicialmente null, definido após o use case de AcceptRide)
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

    return { };
}